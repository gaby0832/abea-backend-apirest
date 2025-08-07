import sql from '../config/sql.js';
import bcrypt from 'bcrypt'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js'
import { verifyAccessToken, generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { getUserById, getUserByEmail, createUser, createUserRefreshToken, deleteUserRefreshToken } from '../models/user.model.js'


const infoUser = async (request, reply)=>{

  try {
    
    const token = request.headers.authorization?.split(' ')[1]
    if (!token) return reply.code(401).send({ message: 'Token não fornecido' })

    const userData = verifyAccessToken(token)
    if (!userData) return reply.code(401).send({ message: 'Token inválido' })

    console.log(userData)
    const user = await getUserById(userData.id)
    if (!user.length) return reply.code(404).send({ message: 'Usuário não encontrado' })
    
    return reply.send(user[0])
  
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ message: 'Erro interno do servidor' })
  }
}

const registerUser = async (request, reply) => {
  const { error, value } = createUserSchema.validate(request.body, { abortEarly: false })

  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.label,
      message: err.message
    }));

    return reply.code(423).send({ data: {message: 'Todos os campos são obrigatórios', error: errorMessages}  })
  }

  const {name, email, password} = value;

  const userExists = await getUserByEmail(email);

  if (userExists.length > 0) {
    return reply.code(423).send({ data: {message: 'Usuário já existe'} })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await createUser(name, email, hashedPassword);
  
  return reply.code(200).send({ data: {message: 'Usuário criado com sucesso!', success: true} })
}


const loginUser = async (request, reply) => {
  const { error, value } = loginUserSchema.validate(request.body)

  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.label,
      message: err.message
    }));

    return reply.code(423).send({ message: 'Todos os campos são obrigatórios', error: errorMessages })
  }
  const {email, password} = value;

  const userExists = await getUserByEmail(email);

  if (userExists.length <= 0) {
    return reply.code(401).send({ data: { message: 'Usuário não registrado' } })
  }
  
  if (userExists && await bcrypt.compare(password, userExists[0].password)) {
  
      const accessToken = generateAccessToken({ id: userExists[0].id, email: userExists[0].email });
      const refreshToken = generateRefreshToken({ id: userExists[0].id });
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = await createUserRefreshToken(userExists[0].id, refreshToken, expiresAt);
    return reply.code(200).send({ data: { token: accessToken, refreshToken: refreshToken, message: 'Usuário logado com sucesso!', success: true } })
  
  }else if(!userExists || await !bcrypt.compare(password, userExists[0].password)){
      return reply.code(401).send({  data: { message: 'Email ou senha invalidos' }});
  }
  
  return reply.code(401).send({ data: { message: 'Credenciais invalidas' } })

}

export async function logoutUser(req, reply) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return reply.code(400).send({ message: 'Token de atualização não fornecido' });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return reply.code(401).send({ message: 'Refresh token inválido ou expirado' });
  }

  const userId = payload.id;

  const result = deleteUserRefreshToken(refreshToken, userId)

  if (result.length === 0) {
    return reply.code(403).send({ message: 'Token não encontrado ou não pertence ao usuário' });
  }

  return reply.send({ message: 'Logout realizado com sucesso' });
}

export default { infoUser, registerUser, loginUser }


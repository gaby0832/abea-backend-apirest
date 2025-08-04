import sql from '../config/sql.js';
import bcrypt from 'bcrypt'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js'
import { verifyToken } from '../utils/jwt.js';


const infoUser = async (request, reply)=>{

  try {
    const token = request.headers.authorization?.split(' ')[1]
    if (!token) return reply.code(401).send({ message: 'Token não fornecido' })

    const userData = verifyToken(token)
    if (!userData) return reply.code(401).send({ message: 'Token inválido' })

      console.log(userData)
    const user = await sql`SELECT id, name, email FROM users WHERE id = ${userData.id}`
    if (!user.length) return reply.code(404).send({ message: 'Usuário não encontrado' })
    return reply.send(user[0]) // retorna só um usuário
  } catch (error) {
    console.error(error)
    return reply.code(500).send({ message: 'Erro interno do servidor' })
  }
}

const createUser = async (request, reply) => {
  const { error, value } = createUserSchema.validate(request.body, { abortEarly: false })

  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.label,
      message: err.message
    }));

    return reply.send({ data: {message: 'Todos os campos são obrigatórios', error: errorMessages}  })
  }

  const {name, email, password} = value;

  const userExists = await sql`
    SELECT 1 FROM users WHERE email = ${email}
  `
  if (userExists.length > 0) {
    return reply.send({ data: {message: 'Usuário já existe'} })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, name, email
  `
  
  return reply.send({ data: {message: 'Usuário criado com sucesso!', success: true} })
}


const loginUser = async (request, reply) => {
  const { error, value } = loginUserSchema.validate(request.body)

  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.label,
      message: err.message
    }));

    return reply.send({ message: 'Todos os campos são obrigatórios', error: errorMessages })
  }
  const {email, password} = value;

  const userExists = await sql`
    SELECT id, email, password
    FROM users WHERE email = ${email}
  `

  if (userExists.length <= 0) {
    return reply.send({ data: { message: 'Usuário não registrado' } })
  }
  
  if (userExists && await bcrypt.compare(password, userExists[0].password)) {
    const token = request.server.jwt.sign(
      { id: userExists[0].id, email: userExists[0].email },  // payload
      { expiresIn: '1h' } // tempo de expiração
    );

    return reply.send({ data: { token: token, message: 'Usuário logado com sucesso!', success: true } })
  
  }else if(!userExists || await !bcrypt.compare(password, userExists[0].password)){
      return reply.send({  data: { message: 'Email ou senha invalidos' }});
  }
  
  return reply.send({ data: { message: 'Credenciais invalidas' } })

}

export default { infoUser, createUser, loginUser }


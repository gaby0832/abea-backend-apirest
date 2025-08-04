import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'sua_chave_super_segura'

export function generateToken(payload) {
  // payload é um objeto: { id, email, role }
  return jwt.sign(payload, SECRET, { expiresIn: '1h' }) // expira em 1 hora
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET) // retorna { id, email, role, iat, exp }
  } catch (err) {
    return null // token inválido ou expirado
  }
}
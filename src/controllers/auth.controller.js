// controllers/auth.controller.js
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';
import { findRefreshTokenInDb, findUserById } from '../models/auth.model.js';

export async function refreshToken(req, reply) {
  const { refreshToken } = req.body;
  if (!refreshToken) return reply.code(400).send({ message: 'Token não fornecido' });

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return reply.code(401).send({ message: 'Token inválido' });

  // Busca o refresh token no banco para garantir que é válido
  const tokenInDb = await findRefreshTokenInDb(refreshToken);
  if (!tokenInDb) return reply.code(401).send({ message: 'Refresh token inválido ou expirado' });

  // Busca o usuário atualizado no banco
  const user = await findUserById(payload.id);
  if (!user) return reply.code(404).send({ message: 'Usuário não encontrado' });

  // Gera um access token com dados atualizados
  const newAccessToken = generateAccessToken({ id: user.id, email: user.email, is_admin: user.is_admin });

  return reply.send({ token: newAccessToken });
}
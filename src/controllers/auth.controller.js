// controllers/auth.controller.js
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';

export async function refreshToken(req, reply) {
  const { refreshToken } = req.body;
  if (!refreshToken) return reply.code(400).send({ message: 'Token não fornecido' });

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return reply.code(401).send({ message: 'Token inválido' });

  const newAccessToken = createAccessToken({ id: payload.id, email: payload.email });
  return reply.send({ token: newAccessToken });
}
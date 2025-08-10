import sql from '../config/sql.js';

export async function createUserRefreshToken(id, refreshToken, expiresAt){
  return await sql`
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (${id}, ${refreshToken}, ${expiresAt})
  `;
}

export async function deleteUserRefreshToken(refreshToken, userId) {
  return await sql`
    DELETE FROM refresh_tokens 
    WHERE token = ${refreshToken} AND user_id = ${userId}
    RETURNING id
  `;
}


export async function findRefreshTokenInDb(token) {
  const result = await sql`
    SELECT * FROM user_refresh_tokens
    WHERE refresh_token = ${token} AND expires_at > NOW()
  `;
  return result[0] || null;
}

// Buscar usuário pelo id
export async function findUserById(id) {
  const result = await sql`
    SELECT id, email, is_admin FROM users WHERE id = ${id}
  `;
  return result[0] || null;
}
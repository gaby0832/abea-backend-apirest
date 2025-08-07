import sql from '../config/sql.js';

export async function getUserByEmail(email) {
  return await sql`
    SELECT id, name, email, password
    FROM users
    WHERE email = ${email}
  `;
}

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

export async function createUser(name, email, password) {
  return await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email
  `;
}



export async function getUserById(id) {
  return await sql`
    SELECT id, name, email
    FROM users
    WHERE id = ${id}
  `;
}
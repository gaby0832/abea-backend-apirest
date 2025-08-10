import sql from '../config/sql.js';

export async function getUserByEmail(email) {
  return await sql`
    SELECT id, name, email, password, is_admin
    FROM users
    WHERE email = ${email}
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
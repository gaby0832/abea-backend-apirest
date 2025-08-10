import sql from '../config/sqlAdmin.js'

export async function getDogs() {
  return await sql`
    SELECT * FROM dogs
    ORDER BY created_at DESC
  `;
}

export async function getDogById(id) {
  const [dog] = await sql`
    SELECT * FROM dogs
    WHERE id = ${id}
  `;
  return dog;
}

export async function createDog({ name, weight, description, age, available, image_url }) {
  const [newDog] = await sql`
    INSERT INTO dogs (name, weight, description, age, available, image_url)
    VALUES (${name}, ${weight}, ${description}, ${age}, ${available}, ${image_url})
    RETURNING *
  `;
  return newDog;
}

export async function updateDog(id, { name, weight, description, age, available, image_url }) {
  const [updatedDog] = await sql`
    UPDATE dogs
    SET name = ${name},
        weight = ${weight},
        description = ${description},
        age = ${age},
        available = ${available},
        image_url = ${image_url},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return updatedDog;
}

export async function deleteDog(id) {
  return await sql`
    DELETE FROM dogs WHERE id = ${id}
  `;
}
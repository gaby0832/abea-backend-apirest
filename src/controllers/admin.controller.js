import sql from '../config/sql.js';
import bcrypt from 'bcrypt'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js'
import { verifyAccessToken, generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { getUserById, getUserByEmail, createUser } from '../models/user.model.js'
import { createDog } from '../models/adoption.model.js'

const addDog = async (request, reply) =>{

}

export default { addDog }


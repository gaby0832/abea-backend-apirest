import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import dotenv from 'dotenv'
dotenv.config()

async function authPlugin(app, options){
    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET,
    })

  // Decorador para ser usado nas rotas
    app.decorate('authenticate', async function (req, reply) {
        try {
            await req.jwtVerify()  // verifica se o token JWT é válido
        } catch (err) {
            reply.code(401).send({ error: 'Token inválido ou ausente' })
        }
    })
    
}

export default fp(authPlugin);


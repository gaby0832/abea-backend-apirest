import fp from 'fastify-plugin'
import dotenv from 'dotenv'
dotenv.config()

async function apiKeyAuth(app, options){
	  app.addHook('onRequest', async (request, reply) => {
		    const apiKey = request.headers['x-api-key'];
		    if (!apiKey || apiKey !== process.env.API_KEY) {
		      return reply.code(401).send({ message: "Credenciais inválidas" });
		    }
 	});
}

export default fp(apiKeyAuth);
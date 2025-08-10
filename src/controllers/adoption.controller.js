import sql from '../config/sql.js';
import { getDogs } from '../models/adoption.model.js'

const getAdoptionDogs = (req, reply) => {
  const dogs = getDogs();
  if(dogs[0].length === 0){
    return reply.code(404).send({ message: "Nenhuma cachorro registrado", sucess: false })
  }
  reply.code(200).send({ message: "Sucesso na requisição", sucess: true, dogs: dogs});
}


export default { getAdoptionDogs }


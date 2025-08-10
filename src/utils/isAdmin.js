export default async function isAdmin(request, reply) {
  const user = request.user;

  if (!user) {
    return reply.status(401).send({ message: 'Usuário não autenticado' });
  }

  if (!user.is_admin) {
    return reply.status(403).send({ message: 'Acesso negado: apenas administradores podem fazer isso' });
  }
}

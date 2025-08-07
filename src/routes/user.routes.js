import userController from '../controllers/user.controller.js'

export default async function userRoutes(app, opts) {

  app.post('/register', userController.registerUser);
  app.post('/login', userController.loginUser);
  app.get('/user',{ preHandler: [app.authenticate] }, userController.infoUser)


}
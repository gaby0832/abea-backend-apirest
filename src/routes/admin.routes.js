import adminController from '../controllers/admin.controller.js'
import isAdmin from '../utils/isAdmin.js'

export default async function adminRoutes(app, opts) {
	app.addHook('preHandler', app.authenticate);
  	app.addHook('preHandler', isAdmin);

	app.post('/dogs', adminController.addDog)
}
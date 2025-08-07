import { refreshToken } from '../controllers/auth.controller.js';

export default async function authRoutes(app) {
  app.post('/refresh', refreshToken);
}
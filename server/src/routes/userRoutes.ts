import { Router } from 'express';
import { UserController } from '../controllers/userController';

export const router = Router();

router.post('/register', UserController.register);

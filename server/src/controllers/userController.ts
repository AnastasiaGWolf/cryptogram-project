import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const UserController = {
  async register(req: Request, res: Response) {
    const user = await UserService.createUser(req.body);
    res.json(user);
  }
};

import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export const UserService = {
  async createUser({ username, password }: { username: string; password: string }) {
    const hash = await bcrypt.hash(password, 10);
    return User.create({ username, password: hash });
  }
};

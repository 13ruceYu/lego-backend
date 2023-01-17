import { UserProps } from './../model/user';
import { Service } from 'egg';

export default class UserService extends Service {
  public async createByEmail(payload: UserProps) {
    const { username, password } = payload;
    const hash = await this.ctx.genHash(password);
    const userCreateData: Partial<UserProps> = {
      username,
      password: hash,
      email: username,
    };
    return this.ctx.model.User.create(userCreateData);
  }
  async findById(id: string) {
    return await this.ctx.model.User.findById(id);
  }
  async findByUsername(username: string) {
    return await this.ctx.model.User.findOne({ username });
  }
}

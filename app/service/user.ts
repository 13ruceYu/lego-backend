import { UserProps } from './../model/user';
import { Service } from 'egg';

export default class UserService extends Service {
  public async createByEmail(payload: UserProps) {
    const { username, password } = payload;
    const userCreateData: Partial<UserProps> = {
      username,
      password,
      email: username,
    };
    return this.ctx.model.User.create(userCreateData);
  }
  async findById(id: string) {
    const result = await this.ctx.model.User.findById(id);

    return result;
  }
}

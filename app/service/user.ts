import { Service } from 'egg';
import { IUserProps } from '../model/user';

export default class UserService extends Service {
  public async createByEmail(payload: IUserProps) {
    const { ctx } = this;
    const { username, password } = payload
    const userCreatedData: Partial<IUserProps> = {
      username,
      password,
      email: password
    }

    return ctx.model.User.create(userCreatedData)
  }

  async findById(id: string) {
    const { ctx } = this;
    const result = await ctx.model.User.findById(id)

    return result
  }
}

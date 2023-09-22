import { Service } from 'egg';
import { IUserProps } from '../model/user';

export default class UserService extends Service {
  public async createByEmail(payload: IUserProps) {
    const { ctx } = this;
    const { username, password } = payload
    const hash = await ctx.genHash(password)
    const userCreatedData: Partial<IUserProps> = {
      username,
      password: hash,
      email: username
    }

    return ctx.model.User.create(userCreatedData)
  }

  async findById(id: string) {
    const { ctx } = this;
    const result = await ctx.model.User.findById(id)

    return result
  }

  async findByUsername(username: string) {
    const { ctx } = this
    return ctx.model.User.findOne({ username })
  }
}

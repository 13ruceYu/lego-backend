import { sign } from 'jsonwebtoken';
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

  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this;
    const user = await this.findByUsername(cellphone);
    // 检查 user 是否存在
    if (user) {
      const token = sign({ username: user.username }, app.config.jwt.secret)
      return token;
    }
    // 新建一个用户
    const userCreateData: Partial<IUserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `lego-${cellphone.slice(-4)}`,
      type: 'cellphone'
    }
    const newUser = await ctx.model.User.create(userCreateData)
    const token = sign({ username: newUser.username }, app.config.jwt.secret)
    return token;
  }
}

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
  async loginByCellphone(cellphone: string) {
    const { ctx, app } = this;
    const user = await this.findByUsername(cellphone);
    // 检查 user 记录是否存在
    if (user) {
      // gen token
      const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret);
      return token;
    }
    // 新建一个用户
    const userCreatedData: Partial<UserProps> = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `乐高${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret);
    return token;
  }
}

import { UserProps } from './../model/user';
import { Service } from 'egg';

interface GiteeUserResp {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

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
  async getAccessToken(code: string) {
    const { ctx, app } = this;
    const { cid, secret, redirectURL, authURL } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl(authURL, {
      method: 'post',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        client_secret: secret,
        redirect_uri: redirectURL,
      },
    });
    app.logger.info(data);
    return data.access_token;
  }
  // get gitee user data
  async getGiteeUser(access_token: string) {
    const { ctx, app } = this;
    const { giteeUserApi } = app.config.giteeOauthConfig;
    const { data } = await ctx.curl<GiteeUserResp>(`${giteeUserApi}?access_token=${access_token}`, {
      dataType: 'json',
    });
    return data;
  }
  async loginByGitee(code: string) {
    const { app, ctx } = this;
    // get access_token
    const accessToken = await this.getAccessToken(code);
    // get user info
    const user = await this.getGiteeUser(accessToken);
    const { id, name, avatar_url, email } = user;
    const stringId = id.toString();
    // Gitee + id | Github + id | WX + id
    const existUser = await this.findByUsername(`Gitee${stringId}`);
    // if user exist
    if (existUser) {
      const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret);
      return token;
    }
    // if user not exist
    const userCreatedData: Partial<UserProps> = {
      oauthID: stringId,
      provider: 'gitee',
      username: `Gitee${stringId}`,
      picture: avatar_url,
      nickName: name,
      email,
      type: 'oauth',
    };
    const newUser = await ctx.model.User.create(userCreatedData);
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret);
    return token;
  }
}

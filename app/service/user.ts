import { sign } from 'jsonwebtoken';
import { Service } from 'egg';
import { IUserProps } from '../model/user';

interface IGithubUserResp {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

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
      const token = sign({ username: user.username, _id: user._id }, app.config.jwt.secret)
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
    const token = sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret)
    return token;
  }

  async getAccessToken(code: string) {
    const { ctx, app } = this;
    const { cid, secret, redirectURL, authURL } = app.config.giteeOAuthConfig;
    const { data } = await ctx.curl(authURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        redirect_uri: redirectURL,
        client_secret: secret
      }
    })
    return data;
  }

  async getAccessTokenGithub(code: string) {
    const { ctx, app } = this;
    const { cid, secret, redirectURL, authURL } = app.config.githubOAuthConfig;
    const { data } = await ctx.curl(authURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        redirect_uri: redirectURL,
        client_secret: secret
      }
    })
    return data.access_token;
  }

  async getGithubUserData(access_token: string) {
    const { app, ctx } = this;
    const { githubUserApi } = app.config.githubOAuthConfig;
    const { data } = await ctx.curl<IGithubUserResp>(githubUserApi, {
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return data
  }

  async loginByGithub(code: string) {
    const { app } = this;
    const accessToken = await this.getAccessTokenGithub(code)
    const user = await this.getGithubUserData(accessToken)
    const { id, name, avatar_url, email } = user;
    const stringId = id.toString()
    // github: 'Github{stringId}'
    // weChat: 'WX{stringId}'
    // gitee: 'Gitee${stringId}'
    const username = `Github${stringId}`
    const existUser = await this.findByUsername(username)
    // 如果用户存在
    if (existUser) {
      const token = sign({ username, _id: existUser._id }, app.config.jwt.secret)
      return token;
    }
    // 如果用户不存在
    const userCreateData: Partial<IUserProps> = {
      oauthId: stringId,
      provider: 'github',
      username,
      picture: avatar_url,
      nickName: name,
      email,
      type: 'oauth'
    }

    const newUser = await this.ctx.model.User.create(userCreateData)
    const token = sign({ username: newUser.username, _id: newUser._id }, app.config.jwt.secret)
    return token;
  }
}

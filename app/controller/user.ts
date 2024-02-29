import { Controller } from 'egg';
import { sign } from 'jsonwebtoken';
import validateInput from '../decorator/inputValidate';

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

const sendCodeRules = {
  phoneNumber: {
    type: 'string',
    format: /^1[3-9]\d{9}$/,
    message: '手机号码格式有误',
  },
};

export default class UserController extends Controller {
  @validateInput(userCreateRules, 'userValidateFail')
  async createByEmail() {
    const { ctx, service } = this;
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  @validateInput(userCreateRules, 'userValidateFail')
  async loginByEmail() {
    const { ctx, service, app } = this;
    // 根据 username 取得用户信息
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    const isPwdCorrect = await ctx.compare(password, user.password);
    if (!isPwdCorrect) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    const token = sign({ username: user.username, _id: user._id }, app.config.jwt.secret, { expiresIn: app.config.jwtExpires });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }

  @validateInput(sendCodeRules, 'userValidateFail')
  async loginByPhoneNumber() {
    const { ctx, app } = this;
    const { phoneNumber, veriCode } = ctx.request.body;
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'loginVeriCodeIncorrectFailInfo' });
    }
    const token = await ctx.service.user.loginByCellphone(phoneNumber);
    ctx.helper.success({ ctx, res: { token } });
  }

  @validateInput(sendCodeRules, 'userValidateFail')
  async sendVeriCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body;
    // 获取 redis 的数据
    // phoneVeriCode-13233344445
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    // 判断是否存在，存在说明已请求
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyInfo' });
    }
    // 不存在，创建验证码
    const veriCode = Math.floor((Math.random() * 9000 + 1000)).toString();
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ ctx, res: { veriCode } });
  }

  async getUserInfo() {
    const { ctx, service } = this;
    const userData = await service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData });
  }

  async oauth() {
    const { app, ctx } = this;
    const { cid, redirectURL } = app.config.giteeOAuthConfig;
    ctx.unsafeRedirect(`https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}&response_type=code`);
  }

  async oauthGithub() {
    const { app, ctx } = this;
    const { cid, redirectURL } = app.config.githubOAuthConfig;
    ctx.unsafeRedirect(`https://github.com/login/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}`);
  }

  async oauthByGitee() {
    const { ctx } = this;
    const { code } = ctx.request.queries;
    const resp = await this.service.user.getAccessToken(code[0]);
    if (resp) {
      ctx.helper.success({ ctx, res: resp });
    }
  }

  async oauthByGithub() {
    const { ctx } = this;
    const { code } = ctx.request.query;
    const { referer } = ctx.request.header;
    try {
      const token = await this.service.user.loginByGithub(code);
      // ctx.helper.success({ ctx, res: { token } });
      await ctx.render('success.nj', { token, referer });
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'githubOauthError' });
    }
  }

}

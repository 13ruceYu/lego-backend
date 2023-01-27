import { Controller } from 'egg';
import inputValidator from '../decorator/inputValidator';

const userCreateRules = {
  username: 'email',
  password: {
    type: 'password',
    min: 8,
  },
};

const userPhoneCreateRules = {
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
  veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码格式错误' },
};

const sendCodeRules = {
  phoneNumber: {
    type: 'string',
    format: /^1[3-9]\d{9}$/,
    message: '手机号码格式错误',
  },
};

export default class UserController extends Controller {
  @inputValidator(userCreateRules, 'userValidateFail')
  async createByEmail() {
    const { service, ctx } = this;
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }
  @inputValidator(sendCodeRules, 'userValidateFail')
  async sendVeriCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body;
    // 获取 redis 数据
    // phoneVeriCode-13311112222
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    // 判断是否存在
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyFailInfo' });
    }
    // [0 - 1)
    // [0 - 1) * 9000 = [0, 9000)
    // [0 - 9000) + 1000 = [1000, 10000)
    const veriCode = Math.floor(Math.random() * 9000 + 1000).toString();
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ ctx, res: { veriCode } });
  }
  @inputValidator(userCreateRules, 'loginValidateFail')
  async loginByEmail() {
    const { ctx, service, app } = this;
    // 根据 username 取得用户信息
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    // 检查用户是否存在
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    const verifyPwd = await ctx.compare(password, user.password);
    // 验证密码是否成功
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    // ctx.cookies.set('username', user.username, { encrypt: true });
    // ctx.session.visitor = user.username;
    // registered claims 注册相关信息
    // public claims 公共信息：should be unique like email, address, phone number
    const token = app.jwt.sign({ username: user.username, _id: user._id }, this.app.config.jwt.secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }
  @inputValidator(userPhoneCreateRules, 'userValidateFail')
  async loginByCellphone() {
    const { ctx, app } = this;
    const { phoneNumber, veriCode } = ctx.request.body;
    // 验证码是否正确
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'loginVeriCodeIncorrectFailInfo' });
    }
    const token = await ctx.service.user.loginByCellphone(phoneNumber);
    ctx.helper.success({ ctx, res: { token } });
  }
  async show() {
    const { ctx, service } = this;
    // const { visitor } = ctx.session;
    // const userData = await service.user.findById(ctx.params.id);
    // if (!visitor) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    // }
    // const userData = ctx.cookies.get('username', { encrypt: true });

    // const token = this.getTokenValue();
    // if (!token) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    // }
    // try {
    //   const decoded = verify(token, app.config.secret);
    //   ctx.helper.success({ ctx, res: decoded });
    // } catch (e) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    // }
    const userData = await service.user.findByUsername(ctx.state.user.username);

    ctx.helper.success({ ctx, res: userData });
  }
  async oauth() {
    const { app, ctx } = this;
    const { cid, redirectURL } = app.config.giteeOauthConfig;
    ctx.redirect(`https://gitee.com/oauth/authorize?client_id=${cid}&redirect_uri=${redirectURL}&response_type=code`);
  }
  async oauthByGitee() {
    const { ctx } = this;
    const { code } = ctx.request.query;
    try {
      const token = await ctx.service.user.loginByGitee(code);
      // ctx.helper.success({ ctx, res: { token } });
      await ctx.render('success.nj', { token });
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'giteeOauthError' });
    }
  }
}

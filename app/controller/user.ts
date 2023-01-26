import { Controller } from 'egg';

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

export const userErrorMessages = {
  userValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  createUserAlreadyExists: {
    errno: 101002,
    message: '该邮箱已经被注册，请直接登录',
  },
  loginCheckFailInfo: {
    errno: 101003,
    message: '用户不存在或者密码输入错误',
  },
  loginValidateFail: {
    errno: 101004,
    message: '登录校验失败',
  },
  sendVeriCodeFrequentlyFailInfo: {
    errno: 101005,
    message: '请勿频繁获取短信验证码',
  },
  loginVeriCodeIncorrectFailInfo: {
    errno: 101006,
    message: '验证码不正确',
  },
  // gitee 授权错误
  giteeOauthError: {
    errno: 101008,
    message: 'Gitee 授权出错',
  },
};

export default class UserController extends Controller {
  async createByEmail() {
    const { service, ctx } = this;
    const errors = this.validateUserInput(userCreateRules);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }
  validateUserInput(rules: any) {
    const { ctx, app } = this;
    const errors = app.validator.validate(rules, ctx.request.body);
    ctx.logger.warn(errors);
    return errors;
  }
  async sendVeriCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body;
    const error = this.validateUserInput(sendCodeRules);
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error });
    }
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
  async loginByEmail() {
    const { ctx, service, app } = this;
    // 检查用户输入
    const error = this.validateUserInput(userCreateRules);
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error });
    }
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
    const token = app.jwt.sign({ username: user.username }, this.app.config.jwt.secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }
  async loginByCellphone() {
    const { ctx, app } = this;
    const { phoneNumber, veriCode } = ctx.request.body;
    // 检查用户输入
    const error = this.validateUserInput(userPhoneCreateRules);
    if (error) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error });
    }
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
      ctx.helper.success({ ctx, res: { token } });
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'giteeOauthError' });
    }
  }
}

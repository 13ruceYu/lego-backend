import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import 'dotenv/config'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1631677352881_6029';

  // add your egg config in here
  config.middleware = [ ];

  config.security = {
    csrf: {
      enable: false
    }
  }
  config.view = {
    defaultViewEngine: 'nunjucks'
  }
  config.logger = {
    consoleLevel: 'DEBUG'
  }
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/lego',
  }
  config.bcrypt = {
    saltRound: 10
  }
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    }
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  const giteeOAuthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://localhost:7001/api/users/oauth/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code'
  }
  const githubOAuthConfig = {
    cid: process.env.GITHUB_CID,
    secret: process.env.GITHUB_SECRET,
    redirectURL: 'http://localhost:7001/api/users/oauth/github/callback',
    authURL: 'https://github.com/login/oauth/access_token',
    githubUserApi: 'https://api.github.com/user'
  }
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: [ 'POST', 'GET' ]
    },
    baseUrl: 'default.url',
    jwt: {
      secret: 'i am secret',
    },
    giteeOAuthConfig,
    githubOAuthConfig
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};

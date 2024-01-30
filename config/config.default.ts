import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import 'dotenv/config';
import { join } from 'path';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1631677352881_6029';

  // add your egg config in here

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:8080' ],
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
  };
  config.logger = {
    consoleLevel: 'DEBUG',
  };
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/lego',
    options: {
      useFindAndModify: false,
      user: 'bruce',
      pass: '123456',
    },
  };
  config.jwt = {
    enable: true,
    secret: process.env.JWT_SECRET,
    match: [ '/api/users/getUserInfo', '/api/works', '/api/utils/upload-img', '/api/channel' ],
  };
  config.bcrypt = {
    saltRound: 10,
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };
  config.multipart = {
    whitelist: [ '.png', '.jpg', '.gif', '.webp' ],
    fileSize: '5000kb',
  };
  config.static = {
    dir: [
      { prefix: '/public', dir: join(appInfo.baseDir, 'app/public') },
      { prefix: '/uploads', dir: join(appInfo.baseDir, 'uploads') },
    ],
  };
  config.oss = {
    client: {
      accessKeyId: process.env.ALI_ACCESS_KEY || '',
      accessKeySecret: process.env.ALI_SECRET_KEY || '',
      bucket: process.env.ALI_OSS_BUCKET,
      endpoint: process.env.ALI_OSS_ENDPOINT,
    },
  };
  const giteeOAuthConfig = {
    cid: process.env.GITEE_CID,
    secret: process.env.GITEE_SECRET,
    redirectURL: 'http://localhost:7001/api/users/oauth/gitee/callback',
    authURL: 'https://gitee.com/oauth/token?grant_type=authorization_code',
  };
  const githubOAuthConfig = {
    cid: process.env.GH_CID,
    secret: process.env.GH_SECRET,
    redirectURL: 'http://localhost:7001/api/users/oauth/github/callback',
    authURL: 'https://github.com/login/oauth/access_token',
    githubUserApi: 'https://api.github.com/user',
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    myLogger: {
      allowedMethod: [ 'POST', 'GET' ],
    },
    baseUrl: 'default.url',
    giteeOAuthConfig,
    githubOAuthConfig,
    H5BaseURL: 'http://localhost:7001/api/pages',
    jwtExpires: '7 days',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};

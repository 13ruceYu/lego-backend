import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'prod.url';
  // 1. 配置 mongoDB，redis 的用户名，密码
  // 2. 配置 cors 允许的域名
  config.security = {
    domainWhiteList: [],
  };
  // 3. jwt 过期时间
  config.jwtExpires = '2 days';
  // 4. 本地 URL 替换
  // config.githubOAuthConfig.redirectURL = '';
  config.githubOAuthConfig = {
    redirectURL: '',
  };
  config.H5BaseURL = '';
  return config;
};

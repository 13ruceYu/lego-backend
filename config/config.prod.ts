import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.mongoose = {
    url: 'mongodb://mongo:27017/lego',
  };
  return config;
};

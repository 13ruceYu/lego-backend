import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },
  hello: {
    enable: true,
    package: 'egg-viking'
  }
};

export default plugin;

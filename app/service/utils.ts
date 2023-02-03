import { renderToString } from '@vue/server-renderer';
import { Service } from 'egg';
import { createSSRApp } from 'vue';
import LegoComponent from 'lego-components';

export default class UserService extends Service {
  propsToStyle(props = {}) {
    const keys = Object.keys(props);
    const styleArr = keys.map(key => {
      const formatKey = key.replace(/[A-Z]/g, c => `-${c.toLocaleLowerCase()}`);
      // fontSize -> font-size
      const value = props[key];
      return `${formatKey}: ${value}`;
    });
    return styleArr.join(';');
  }
  px2vm(components = []) {
    const reg = /^(\d+(\.\d+)?)px$/;
    components.forEach((component: any = []) => {
      const props = component.props || {};
      // 遍历组件属性
      Object.keys(props).forEach(key => {
        const val = props[key];
        if (typeof val !== 'string') return;
        // val 中没有 px，不是一个长度属性
        if (reg.test(val) === false) {
          return;
        }
        const arr = val.match(reg) || [];
        const numStr = arr[1];
        const num = parseFloat(numStr);
        // 计算 vw，重新赋值
        // 前端编辑器画布宽度是 375
        const vwNum = (num / 375) * 100;
        props[key] = `${vwNum.toFixed(2)}vw`;
      });
    });
  }
  async renderToPageData(query: { id: number, uuid: string }) {
    const work = await this.ctx.model.Work.findOne(query).lean();
    if (!work) {
      throw new Error('work not exist');
    }
    const { title, desc, content } = work;
    this.px2vm(content && content.components);
    const vueApp = createSSRApp({
      data: () => ({
        components: (content && content.components) || [],
      }),
      template: '<final-page :components="components"></final-page>',
    });
    vueApp.use(LegoComponent);
    const html = await renderToString(vueApp);
    const bodyStyle = this.propsToStyle(content && content.props);
    return {
      html,
      title,
      desc,
      bodyStyle,
    };
  }
}

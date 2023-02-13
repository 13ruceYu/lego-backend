import { Service } from 'egg';
export default class UserService extends Service {
    propsToStyle(props?: {}): string;
    px2vm(components?: never[]): void;
    renderToPageData(query: {
        id: number;
        uuid: string;
    }): Promise<{
        html: string;
        title: string;
        desc: string;
        bodyStyle: string;
    }>;
}

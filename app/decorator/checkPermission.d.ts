import { GlobalErrorTypes } from '../error';
interface ModelMapping {
    mongoose: string;
    casl: string;
}
interface IOptions {
    action?: string;
    key?: string;
    value?: {
        type: 'params' | 'body';
        valueKey: string;
    };
}
/**
 * @param modelName model 名称，可以是普通字符串，也可以是 casl 和 mongoose 的映射关系
 * @param errorType 返回错误类型，来自 GlobalErrorTypes
 * @param options 特殊配制选项，可以自定义 action 以及查询条件，详见上面的 IOptions 选项
 * return: function
 */
export default function checkPermission(modelName: string | ModelMapping, errorType: GlobalErrorTypes, options?: IOptions): (_prototype: any, _key: string, descriptor: PropertyDescriptor) => void;
export {};

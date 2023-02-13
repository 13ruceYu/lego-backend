import { Context } from 'egg';
import { GlobalErrorTypes } from '../error';
interface RespType {
    ctx: Context;
    res?: any;
    msg?: string;
}
interface ErrorRespType {
    ctx: Context;
    errorType: GlobalErrorTypes;
    error?: any;
}
declare const _default: {
    success({ ctx, res, msg }: RespType): void;
    error({ ctx, error, errorType }: ErrorRespType): void;
};
export default _default;

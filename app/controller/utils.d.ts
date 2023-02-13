import { Controller } from 'egg';
export default class UtilsController extends Controller {
    pathToURL(path: string): string;
    uploadToOss(): Promise<void>;
    uploadFileUseBusboy(): Promise<unknown>;
    testBusboy(): Promise<void>;
    uploadMultipleFiles(): Promise<void>;
    splitIdAndUuid(str?: string): {
        id: number;
        uuid: string;
    };
    renderH5Page(): Promise<void>;
}

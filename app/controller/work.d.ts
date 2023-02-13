import { Controller } from 'egg';
export interface IndexCondition {
    pageIndex?: number;
    pageSize?: number;
    select?: string | string[];
    populate?: {
        path?: string;
        select?: string;
    };
    customSort?: Record<string, any>;
    find?: Record<string, any>;
}
export default class WorkController extends Controller {
    createChannel(): Promise<void>;
    getWorkChannel(): Promise<void>;
    updateChannelName(): Promise<void>;
    deleteChannel(): Promise<void>;
    createWork(): Promise<void>;
    myList(): Promise<void>;
    templateList(): Promise<void>;
    update(): Promise<void>;
    delete(): Promise<void>;
    publish(isTemplate: boolean): Promise<void>;
    publishWork(): Promise<void>;
    publishTemplate(): Promise<void>;
}

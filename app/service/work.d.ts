/// <reference types="mongoose" />
import { WorkProps } from './../model/work';
import { Service } from 'egg';
import { IndexCondition } from '../controller/work';
export default class WorkService extends Service {
    createEmptyWork(payload: any): Promise<WorkProps & import("mongoose").Document<any, any, WorkProps>>;
    getList(condition: IndexCondition): Promise<{
        count: number;
        list: WorkProps[];
        pageIndex: number;
        pageSize: number;
    }>;
    publish(id: number, isTemplate?: boolean): Promise<string>;
}

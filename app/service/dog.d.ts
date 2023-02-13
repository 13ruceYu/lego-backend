/// <reference types="mongoose" />
import { Service } from 'egg';
interface DogResp {
    message: string;
    status: string;
}
export default class DogService extends Service {
    show(): Promise<DogResp>;
    showPlayers(): Promise<(import("../model/user").UserProps & import("mongoose").Document<any, any, import("../model/user").UserProps>)[]>;
}
export {};

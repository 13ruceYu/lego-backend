/// <reference types="mongoose" />
import { UserProps } from './../model/user';
import { Service } from 'egg';
interface GiteeUserResp {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    email: string;
}
export default class UserService extends Service {
    createByEmail(payload: UserProps): Promise<UserProps & import("mongoose").Document<any, any, UserProps>>;
    findById(id: string): Promise<(UserProps & import("mongoose").Document<any, any, UserProps>) | null>;
    findByUsername(username: string): Promise<(UserProps & import("mongoose").Document<any, any, UserProps>) | null>;
    loginByCellphone(cellphone: string): Promise<string>;
    getAccessToken(code: string): Promise<any>;
    getGiteeUser(access_token: string): Promise<GiteeUserResp>;
    loginByGitee(code: string): Promise<string>;
}
export {};

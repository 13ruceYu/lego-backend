/// <reference types="mongoose" />
import { Application } from 'egg';
export interface UserProps {
    username: string;
    password: string;
    email?: string;
    nickName?: string;
    picture?: string;
    phoneNumber?: string;
    createAt: Date;
    updateAt: Date;
    type: 'email' | 'cellphone' | 'oauth';
    provider?: 'gitee';
    oauthID?: string;
    role?: 'admin' | 'normal';
}
declare function initUserModel(app: Application): import("mongoose").Model<UserProps, {}, {}>;
export default initUserModel;

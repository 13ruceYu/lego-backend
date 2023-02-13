import { Controller } from 'egg';
export default class UserController extends Controller {
    createByEmail(): Promise<void>;
    sendVeriCode(): Promise<void>;
    loginByEmail(): Promise<void>;
    loginByCellphone(): Promise<void>;
    show(): Promise<void>;
    oauth(): Promise<void>;
    oauthByGitee(): Promise<void>;
}

import { userErrorMessages } from './user';
import { workErrorMessages } from './work';
import { utilsErrorMessages } from './utils';
export type GlobalErrorTypes = keyof (typeof userErrorMessages & typeof workErrorMessages & typeof utilsErrorMessages);
export declare const globalErrorMessages: {
    imgUploadFail: {
        errno: number;
        message: string;
    };
    imageUploadFailFormatError: {
        errno: number;
        message: string;
    };
    imageUploadFailSizeError: {
        errno: number;
        message: string;
    };
    h5WorkNotExistError: {
        errno: number;
        message: string;
    };
    workValidateFail: {
        errno: number;
        message: string;
    };
    workNoPermissionFail: {
        errno: number;
        message: string;
    };
    channelValidateFail: {
        errno: number;
        message: string;
    };
    channelOperateFail: {
        errno: number;
        message: string;
    };
    userValidateFail: {
        errno: number;
        message: string;
    };
    createUserAlreadyExists: {
        errno: number;
        message: string;
    };
    loginCheckFailInfo: {
        errno: number;
        message: string;
    };
    loginValidateFail: {
        errno: number;
        message: string;
    };
    sendVeriCodeFrequentlyFailInfo: {
        errno: number;
        message: string;
    };
    loginVeriCodeIncorrectFailInfo: {
        errno: number;
        message: string;
    };
    giteeOauthError: {
        errno: number;
        message: string;
    };
};

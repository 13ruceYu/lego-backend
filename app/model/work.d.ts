import { Application } from 'egg';
import { ObjectId } from 'mongoose';
interface ChannelProps {
    name: string;
    id: string;
}
export interface WorkProps {
    id?: number;
    uuid: string;
    title: string;
    desc: string;
    coverImg?: string;
    content?: {
        [key: string]: any;
    };
    isTemplate?: boolean;
    isPublic?: boolean;
    isHot?: boolean;
    author: string;
    copiedCount: number;
    status?: 0 | 1 | 2;
    user: ObjectId;
    latestPublishAt?: Date;
    channels?: ChannelProps[];
}
declare function initWorkModel(app: Application): import("mongoose").Model<WorkProps, {}, {}>;
export default initWorkModel;

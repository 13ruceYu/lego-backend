import { Document } from 'mongoose';
import { UserProps } from '../model/user';
export default function defineRoles(user: UserProps & Document<any, any, UserProps>): import("@casl/ability").AnyMongoAbility;

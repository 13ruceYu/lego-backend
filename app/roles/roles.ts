import { IUserProps } from './../model/user';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Document } from 'mongoose';

export default function defineRoles(user: IUserProps & Document<any, any, IUserProps>) {
  const { can, build } = new AbilityBuilder(createMongoAbility);
  if (user) {
    if (user.role === 'admin') {
      can('manage', 'all');
    } else {
      // normal login user
      // read own info, and update specific fields
      can('read', 'User', { _id: user._id });
      can('update', 'User', [ 'nickName', 'picture' ], { _id: user._id });
      // works, 可以创建，然后可以更新和删除自己的 Work
      can('create', 'Work', [ 'title', 'desc', 'content', 'coverImg' ]);
      can('read', 'Work', { user: user._id });
      can('update', 'Work', [ 'title', 'desc', 'content', 'coverImg' ], { user: user._id });
      can('delete', 'Work', { user: user._id });
      can('publish', 'Work', { user: user._id });
      // channels, 创建，更新和删除属于自己的 channel
      can('create', 'Channel', [ 'name', 'workId' ], { user: user._id });
      can('read', 'Channel', { user: user._id });
      can('update', 'Channel', [ 'name' ], { user: user._id });
      can('delete', 'Channel', [ 'name' ], { user: user._id });
    }
  }
  return build();
}

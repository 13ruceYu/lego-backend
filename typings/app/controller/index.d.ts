// This file is created by egg-ts-helper@1.26.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportTest from '../../../app/controller/test';
import ExportUser from '../../../app/controller/user';
import ExportUtils from '../../../app/controller/utils';
import ExportWork from '../../../app/controller/work';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    test: ExportTest;
    user: ExportUser;
    utils: ExportUtils;
    work: ExportWork;
  }
}

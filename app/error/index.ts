import { userErrorMessage } from './user';
import { workErrorMessages } from './work';
import { utilsErrorMessages } from './utils';

export type GlobalErrorTypes = keyof (typeof userErrorMessage & typeof workErrorMessages & typeof utilsErrorMessages);

export const globalErrorMessages = {
  ...userErrorMessage,
  ...workErrorMessages,
  ...utilsErrorMessages,
};

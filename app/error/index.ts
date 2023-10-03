import { userErrorMessage } from './user'
import { workErrorMessages } from './work'

export type GlobalErrorTypes = keyof (typeof userErrorMessage & typeof workErrorMessages);

export const globalErrorMessages = {
  ...userErrorMessage,
  ...workErrorMessages
}

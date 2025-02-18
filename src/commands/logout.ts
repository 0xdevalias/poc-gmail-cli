import { CommandModuleWithConfig } from '../lib/config'
import { logout } from '../lib/auth'

/**
 * Logout command
 *
 * @see https://yargs.js.org/docs/#api-reference-commandmodule
 */
export const logoutCommand: CommandModuleWithConfig = {
  command: 'logout',
  describe: 'Log out from Gmail',
  handler: () => {
    logout()
  },
}

import { CommandModuleWithConfig } from '../lib/config'
import { authenticateWithOOBFlow } from '../lib/auth'

/**
 * Login command
 *
 * @see https://yargs.js.org/docs/#api-reference-commandmodule
 */
export const loginCommand: CommandModuleWithConfig = {
  command: 'login',
  describe: 'Log in to Gmail via OAuth',
  handler: async (config) => {
    const tokens = await authenticateWithOOBFlow()

    // TODO: output something more useful here
    console.log(tokens)
  },
}

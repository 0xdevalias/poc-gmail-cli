import { CLIConfigOptions } from '../lib/config'

import { loginCommand } from './login'
import { logoutCommand } from './logout'
import { CommandModule } from 'yargs'

export { loginCommand, logoutCommand }

// TODO: we can't seem to set a more explicit type here without breaking the main yargs.commands types;
//   i've hacked around it by casting cliCommands as any at the usage.. but we should figure this out properly...
export const cliCommands: CommandModule<CLIConfigOptions, any>[] = [
  loginCommand,
  logoutCommand,
]

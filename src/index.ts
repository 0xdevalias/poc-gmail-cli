#!/usr/bin/env node_modules/.bin/tsx

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { cliCommands } from './commands/'
import {
  CLIConfigOptions,
  configOptions,
  loadAndParseCLIConfig,
} from './lib/config'

// TODO: Think of a nice pattern for ensuring that pre-reqs are setup/checked (eg. auth, gmail client, etc) before
//   running any command that needs them. Or should we just define the helper methods and let the individual commands
//   call them as needed? Given we only run 1 command per execution.. that's probably a fine approach to it.

// TODO: (I think this is mostly if not entirely done now..?) we should get the type T from src/lib/config.ts and use it as per:
//   The type parameter T is the expected shape of the parsed options. Arguments<T> is those options plus _ and $0, and an indexer falling back to unknown for unknown options.
//   For the return type / argv property, we create a mapped type over Arguments<T> to simplify the inferred type signature in client code.
yargs(hideBin(process.argv))
  .scriptName('poc-gmail-cli')
  // TODO: make sure we add a thing to parse the config here.. https://yargs.js.org/docs/#api-reference-configkey-description-parsefn
  // .middleware((config) => {
  //   // Display parsed config if debug is enabled
  //   if (config?.debug) {
  //     console.error("Config:", config);
  //   }
  // })
  // .option("debug", {
  //   describe: "Enable debug mode",
  //   type: "boolean",
  //   default: ["1", "true"].includes(process.env.DEBUG),
  //   global: true,
  // })
  .options<CLIConfigOptions>(configOptions)
  // TODO: we can't seem to set a more explicit type for cliCommands without breaking the main yargs.commands types;
  //   i've hacked around it by casting cliCommands as any at the usage.. but we should figure this out properly...
  .command(cliCommands as any)
  // TODO: add .env support here as well: https://yargs.js.org/docs/#api-reference-envprefix
  .config('config', loadAndParseCLIConfig)
  .completion()
  .version()
  // TODO: How can we stop the help text prefixing all of the commands with the script name?
  //     Specifically relevant: https://github.com/yargs/yargs/issues/1964
  //     Older/less specifically relevant: https://github.com/yargs/yargs/issues/1010
  .help()
  .alias('help', 'h')
  .recommendCommands() // Provide suggestions regarding similar commands if no matching command is found
  .demandCommand(1, '') // Require at least 1 command, show no error message
  .strict(true)
  .parseAsync()

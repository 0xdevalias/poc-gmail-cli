import fs from "fs";

import { config as dotenvConfig } from 'dotenv';
import {ArgumentsCamelCase, Argv, CommandModule, InferredOptionTypes, Options} from "yargs";

import { parse as parseJson } from 'json5';

export interface CLIConfig {
  'google-credentials-json'?: string
}

export type CLIConfigOptions<T extends Record<string, any> = CLIConfig> = {
  [Key in keyof Required<T>]: Options;
};

/**
 * TODO: Make this work so that we can pass an explicit type for the 2nd generic argument of CommandModule
 *   currently it seems to cause issues with the return type from the builder function, seemingly to based on,
 *   how the following types are applied: Omit<CLIConfigOptions<CLIConfig>, 'foo'> & InferredOptionTypes<{ foo: { type: 'string' } }>
 *
 * @example TODO: figure out how to make this work with all the example code commented out below
 */
export type CommandModuleWithConfig = CommandModule<CLIConfigOptions, {}>;
// export type CommandModuleWithConfig<ExtendedOptions = {}> = CommandModule<CLIConfigOptions, CLIConfigOptions & ExtendedOptions>;

// export const fooCommand: CommandModuleWithConfig = {
//   builder: (yargs) => { return yargs },
//   handler: (yargs: ArgumentsCamelCase<InferredOptionTypes<CLIConfigOptions>>) => { /* TODO */ }
// }
//
// // interface Test1 {
// //   foo: number
// // }
// // interface FooCommand2BuilderConfig {
// //   foo: string
// //   bar: string
// // }
//
// // type ExcludeKeys<T, U> = {
// //   [K in Exclude<keyof T, keyof U>]: T[K];
// // };
// //
// // type Foo2 = ExcludeKeys<Test1, FooCommand2BuilderConfig>
// //
// // const aa: Foo2 = { foo: 1 }
// // type FooCommand2BuilderConfigOptions = CLIConfigOptions<FooCommand2BuilderConfig>
// // type FooCommand2BuilderConfig = Argv<
// //   Omit<CLIConfigOptions<CLIConfig>, 'foo'> & InferredOptionTypes<{ foo: { type: 'string' } }>
// // >;
// // type FooCommand2BuilderConfig = Argv<
// //   Omit<CLIConfigOptions<CLIConfig>, 'foo'> & InferredOptionTypes<{ foo: { type: 'string' } }>
// // >;
// // Pick<T, Exclude<keyof T, K>>
// // type FooCommand2BuilderConfig<T, U> = Argv<
// //   Omit<T, U> & InferredOptionTypes<{ foo: { type: 'string' } }>
// // >;
//
// export interface FooConfig {
//   'foo': string
// }
// export type FooConfigOptions = CLIConfigOptions<FooConfig>
// export const fooCommand2: CommandModuleWithConfig<FooConfigOptions> = {
//   builder: (yargs) => {
//     const aa:Argv<FooConfigOptions> = yargs.option({
//       'foo': {
//         type: 'string',
//       },
//     })
//     // .option({
//     //   'bar': {
//     //     type: 'string',
//     //   },
//     // })
//     return aa;
//   },
//   handler: (
//     yargs
//   ) => {
//     /* TODO */
//   },
// }
//
// export const fooCommand2: CommandModuleWithConfig<CLIConfigOptions> = {
//   builder: (yargs) => { return yargs },
//   handler: (yargs: ArgumentsCamelCase<InferredOptionTypes<CLIConfigOptions>>) => { /* TODO */ }
// }

// export const loginCommand: CommandModuleWithConfig<CLIConfig> = {
// export const loginCommand: CommandModuleWithConfig<CLIConfig & { foo: string }> = {
//   builder: (yargs) => {
//     // return yargs
//     return yargs as Argv<CLIConfig & { foo: string }>
//   },
// }

export const configOptions: CLIConfigOptions = {
  'google-credentials-json': {
    alias: 'creds',
    describe: 'Google credentials JSON file path',
    type: 'string',
    default: '/etc/passwd',
    demandOption: true,
  }
}

export const loadAndParseCLIConfig = (configPath: string): CLIConfig => {
  // TODO: move this parsing function into src/lib/config.ts and then import it from there
  console.log('Config:', configPath)

  let parsedConfig: CLIConfig = {};
  try {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    parsedConfig = parseJson(configFile) as CLIConfig; // TODO: remove this 'as' cast and do proper validation
  } catch (error) {
    console.error('Error parsing the config file:', error);
    throw new Error('Invalid config file format.');
  }

  return parsedConfig
}

export const loadDotenvConfig = dotenvConfig

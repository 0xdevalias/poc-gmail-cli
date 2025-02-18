# `poc-gmail-cli`

## Usage

First you will need to run:

```shell
npm install
```

Then you can use the script as follows:

```shell
⇒ npm start -- --help

> poc-gmail-cli@0.0.1 start
> tsx src/index.ts --help

poc-gmail-cli <command>

Commands:
  poc-gmail-cli login       Log in to Gmail via OAuth
  poc-gmail-cli logout      Log out from Gmail
  poc-gmail-cli completion  generate completion script

Options:
      --google-credentials-json, --creds  Google credentials JSON file path
                                    [string] [required] [default: "/etc/passwd"]
      --config                            Path to JSON config file
      --version                           Show version number          [boolean]
  -h, --help                              Show help                    [boolean]
```


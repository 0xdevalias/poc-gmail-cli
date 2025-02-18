# TODO

- Ask question on yargs GitHub issues about how to properly implement the cliCommands pattern I am trying to use with CLIConfigOptions in a way that doesn't break all of the TypeScript types
- Rewrite the hacky first implementation in src/auth.ts so it works properly with our new config/lib/etc patterns
- Implement config patterns from:
  - https://github.com/yargs/yargs/blob/main/docs/advanced.md#building-configurable-cli-apps
  - https://yargs.js.org/docs/#api-reference-configkey-description-parsefn
    - > Tells the parser that if the option specified by key is passed in, it should be interpreted as a path to a JSON config file. The file is loaded and parsed, and its properties are set as arguments. 
    - > An optional parseFn can be used to provide a custom parser. The parsing function must be synchronous, and should return an object containing key value pairs or an error.
  - https://yargs.js.org/docs/#api-reference-envprefix
    - > Program arguments are defined in this order of precedence:
      > - Command line args
      > - Env vars
      > - Config file/objects
      > - Configured defaults
  - https://yargs.js.org/docs/#api-reference-pkgconfkey-cwd
- Implement CLI usage? https://yargs.js.org/docs/#api-reference-usage-desc-builder-handler
- Implement CLI examples? https://yargs.js.org/docs/#api-reference-examplecmd1-desc1-cmd2-desc2
- Implement CLI middleware? https://yargs.js.org/docs/#api-reference-middlewarecallbacks-applybeforevalidation
- Implement CLI epilogue? https://yargs.js.org/docs/#api-reference-epiloguestr
- Implement CLI globals? https://yargs.js.org/docs/#api-reference-globalglobals-globaltrue
- Implement CLI groups? https://yargs.js.org/docs/#api-reference-groupkeys-groupname
- Implement the following as required:
  - ```
    Great! With the login and logout commands implemented, you have a good foundation for your Gmail CLI tool. Now let's focus on organizing the code and making it scalable for future additions.

    Here's a plan for what's next:
    - Refactor and Structure: Before adding more features, it's essential to ensure the project structure is organized and scalable.
    - Error Handling and User Feedback: Improve the CLI tool by implementing error handling and providing feedback to the user.
    - Implement Additional Commands: Depending on what features you want to include, you can start adding more commands. For example, you can add commands to list labels, create filters, or manage other Gmail functionalities.
    - Documentation and Help: Add documentation for the CLI tool. This includes inline comments for code and user documentation that outlines how to use the CLI tool.
    - Testing and Debugging: Write tests to make sure that your code is working as expected and debug if necessary.
    - Packaging and Distribution: Finally, you should package your CLI tool so that it can be easily installed and used.
    ``` 
- Should we make use of https://github.com/chalk/chalk ?

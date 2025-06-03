import {CommandRegistry, registerCommands, runCommand} from "./commands.js";
import {login} from "./commands/login.js";

function main(): number {

  const registry: CommandRegistry = {};
  registerCommands(registry, "login", login);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("No command specified");
    return 1;
  }

  const command = args[0];

  const commandArguments = args.slice(1);
  console.log(`Running command ${command} with args ${commandArguments}`);
  return runCommand(registry, command, ...commandArguments);

}

const errorCode = main();
process.exit(errorCode);

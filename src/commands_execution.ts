import {CommandRegistry, registerCommands, runCommand} from "./commands";
import {login} from "./commands/login";
import {register} from "./commands/register";

export async function runCommandFromArgs(command: string, commandArguments: string[]) {
    const registry: CommandRegistry = {};
    registerCommands(registry, "login", login);
    registerCommands(registry, "register", register);

    console.log(`Running command ${command} with args ${commandArguments}`);
    return runCommand(registry, command, ...commandArguments);
}
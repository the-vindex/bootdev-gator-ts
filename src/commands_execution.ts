import {CommandRegistry, registerCommands, runCommand} from "./commands";
import {login} from "./commands/login";
import {register} from "./commands/register";
import {reset} from "./commands/reset";
import {users} from "./commands/users";

export async function runCommandFromArgs(command: string, commandArguments: string[]) {
    const registry: CommandRegistry = {};
    registerCommands(registry, "login", login);
    registerCommands(registry, "register", register);
    registerCommands(registry, "reset", reset);
    registerCommands(registry, "users", users);

    console.log(`Running command ${command} with args ${commandArguments}`);
    return runCommand(registry, command, ...commandArguments);
}
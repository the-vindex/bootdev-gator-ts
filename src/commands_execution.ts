import {CommandRegistry, registerCommands, runCommand} from "./commands";
import {login} from "./commands/login";
import {register} from "./commands/register";
import {reset} from "./commands/reset";
import {users} from "./commands/users";
import {agg} from "./commands/agg";
import {addfeed} from "./commands/addfeed";
import { feeds } from "./commands/feeds";

export type CommandName = keyof CommandRegistry & ("login" | "register" | "reset" | "users" | "agg" | "addfeed");

export async function runCommandFromArgs(command: string, ...commandArguments: string[]) {
    const registry: CommandRegistry = {};
    registerCommands(registry, "login", login);
    registerCommands(registry, "register", register);
    registerCommands(registry, "reset", reset);
    registerCommands(registry, "users", users);
    registerCommands(registry, "agg", agg);
    registerCommands(registry, "addfeed", addfeed);
    registerCommands(registry, "feeds", feeds);

    console.log(`Running command ${command} with args ${commandArguments}`);
    return runCommand(registry, command, ...commandArguments);
}
import {CommandRegistry, registerCommands, runCommand} from "./commands";
import {login} from "./commands/login";
import {register} from "./commands/register";
import {reset} from "./commands/reset";
import {users} from "./commands/users";
import {agg} from "./commands/agg";
import {addfeed} from "./commands/addfeed";
import {feeds} from "./commands/feeds";
import {follow} from "./commands/follow";
import { following } from "./commands/following_feed_display";
import {middlewareLoggedIn} from "./commands/middleware/middlewareLoggedIn";
import {help} from "./commands/help";
import {middlewareRegistryAware} from "./commands/middleware/middlewareRegistryAware";


export type CommandName = keyof CommandRegistry & ("login" | "register" | "reset" | "users" | "agg" | "addfeed" | "feeds" | "follow" | "following");

export async function runCommandFromArgs(command: string, ...commandArguments: string[]) {
    const registry: CommandRegistry = {};
    registerCommands(registry, "help", middlewareRegistryAware(registry, help));
    registerCommands(registry, "login", login);
    registerCommands(registry, "register", register);
    registerCommands(registry, "reset", reset);
    registerCommands(registry, "users", users);
    registerCommands(registry, "agg", agg);
    registerCommands(registry, "addfeed", middlewareLoggedIn(addfeed));
    registerCommands(registry, "feeds", feeds);
    registerCommands(registry, "follow", middlewareLoggedIn(follow));
    registerCommands(registry, "following", middlewareLoggedIn(following));

    console.log(`Running command ${command} with args ${commandArguments}`);
    return runCommand(registry, command, ...commandArguments);
}
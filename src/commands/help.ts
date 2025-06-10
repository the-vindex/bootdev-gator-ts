import {CommandRegistry} from "../commands";

export async function help(cmdName: string, registry: CommandRegistry, ...args: string[]) {
    console.log("help command called with args", args);

    console.log("Available commands:");
    for (const cmd in registry) {
        console.log(`- ${cmd}`);
    }

    return 0;
}

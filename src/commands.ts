export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<number>;

export type CommandRegistry = {
    [cmdName: string]: CommandHandler;
}

export function registerCommands(registry: CommandRegistry, cmdnName:string, cmdHandler: CommandHandler) {
    registry[cmdnName] = cmdHandler;
}

export async function runCommand(registry: CommandRegistry, cmdName: string, ...args: string[]) {
    const cmdHandler = registry[cmdName];
    if (cmdHandler) {
        return await cmdHandler(cmdName, ...args);
    } else{
        console.log(`Unknown command ${cmdName}`);
        return 1;
    }
}

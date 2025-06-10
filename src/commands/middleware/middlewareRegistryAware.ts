import {CommandHandler, CommandRegistry} from "../../commands";

type RegistryCommandHandler = (
    cmdName: string,
    registry: CommandRegistry,
    ...args: string[]
) => Promise<number>;

export function middlewareRegistryAware(registry: CommandRegistry, handler: RegistryCommandHandler): CommandHandler {
    if (!registry) {
        throw new Error("Command registry is not available");
    }

    return async (command: string, ...args: string[]) => {
        return await handler(command, registry, ...args);
    };
}

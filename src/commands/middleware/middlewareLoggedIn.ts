import { User } from "../../lib/db/queries/users";
import {CommandHandler} from "../../commands";
import { getCurrentUser } from "../../utils/get_current_user";

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<number>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (command: string, ...args)=>{
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("You must be logged in to add feeds");
        }
        return await handler(command, user, ...args);
    };
}
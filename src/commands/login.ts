import {Config} from "../config.js";
import {getUserByName} from "../lib/db/queries/users";

export async function login(cmdName: string, ...args: string[]) {
    console.log("Login command called with args", args);

    if (args.length === 0) {
        console.error("No username specified");
        return 1;
    }

    const username = args[0];
    const user = await getUserByName(username);

    if (!user) {
        throw new Error("User does not exist");
    } else {
        console.log("Setting user to", username);
        const config = Config.readConfig();
        config.setUser(username);

        return 0;
    }
}
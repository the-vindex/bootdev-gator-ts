import {Config} from "../config";
import {createUser} from "../lib/db/queries/users";

export async function register(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        console.error("No username specified");
        return 1;
    }

    const username = args[0];
    console.log("Registering user", username);
    let newUser: { id: string; name: string; createdAt: Date; updatedAt: Date; };

    newUser = await createUser(username);
    console.log("User created", newUser);

    Config.readConfig().setUser(username);

    return 0;
}
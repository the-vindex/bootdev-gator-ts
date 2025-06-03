import {Config} from "../config.js";

export function login(cmdName: string, ...args: string[]) {
    console.log("Login command called with args", args);

    if (args.length === 0) {
        console.error("No username specified");
        return 1;
    }

    console.log("Setting user to", args[0]);
    const config = Config.readConfig();
    config.setUser(args[0]);

    return 0
}
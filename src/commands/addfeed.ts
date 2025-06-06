import {createFeed} from "../lib/db/queries/feeds";
import {Config} from "../config";
import {getUserByName} from "../lib/db/queries/users";

export async function addfeed(commandName: string, ...args: string[]) {
    if (args.length < 2) {
        console.warn("Name and URL must be specified");
        return 1;
    }

    const [name, url] = args;

    const username = Config.readConfig().currentUserName;
    const user = await getUserByName(username);

    await createFeed(name, url, user.id);
    console.log(`Feed ${name} added with URL ${url}`);

    return 0;
}
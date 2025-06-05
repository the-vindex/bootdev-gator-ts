import {getUsers} from "../lib/db/queries/users";
import {Config} from "../config";

export async function users() {
    const users = await getUsers();

    const currentUserName = Config.readConfig().currentUserName;

    for (const user of users) {
        let message = `* ${user.name}`;
        if (currentUserName === user.name){
            message += " (current)";
        }
        console.log(message);
    }
    return 0
}
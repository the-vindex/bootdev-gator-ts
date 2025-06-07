import {getUserByName} from "../lib/db/queries/users";
import {Config} from "../config";

export async function getCurrentUser() {
    return getUserByName(Config.readConfig().currentUserName);
}
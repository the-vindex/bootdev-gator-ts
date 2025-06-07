import { getFeedFollowsForUser } from "../lib/db/queries/feeds_follow_queries";
import { getCurrentUser } from "../utils/get_current_user";
import {User} from "../lib/db/queries/users";

export async function following(command: string, user: User) {
    const feedFollows = await getFeedFollowsForUser(user.id);
    console.log("Your followed feeds:");
    for (const follow of feedFollows) {
        console.log(`- ${follow.feedName} (${follow.feedUrl})`);
    }

    return 0;
}
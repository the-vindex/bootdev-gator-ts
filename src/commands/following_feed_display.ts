import { getFeedFollowsForUser } from "../lib/db/queries/feeds_follow_queries";
import { getCurrentUser } from "../utils/get_current_user";

export async function following() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("You must be logged in to see your followed feeds");
        return 1;
    }

    const feedFollows = await getFeedFollowsForUser(user.id);
    console.log("Your followed feeds:");
    for (const follow of feedFollows) {
        console.log(`- ${follow.feedName} (${follow.feedUrl})`);
    }

    return 0;
}
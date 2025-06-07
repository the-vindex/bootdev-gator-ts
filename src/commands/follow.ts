import {createFeedFollow, getFeedByUrl} from "../lib/db/queries/feeds_follow_queries";
import {getCurrentUser} from "../utils/get_current_user";

export async function follow(command: string, url: string) {
    const user = await getCurrentUser();
    if (!user) {
        console.log("You must be logged in to follow feeds");
        return 1;
    }

    const feed = await getFeedByUrl(url);
    if (!feed) {
        console.log("Feed not found");
        return 1;
    }

    await createFeedFollow(user.id, feed.id);
    console.log(`User ${user.name} is now following feed ${feed.name}`);
    return 0;
}
import {deleteFeedFollow, getFeedByUrl} from "../lib/db/queries/feeds_follow_queries";
import {User} from "../lib/db/queries/users";

export async function unfollow(command: string, user: User, url: string) {
    const feed = await getFeedByUrl(url);
    if (!feed) {
        console.log("Feed not found");
        return 1;
    }

    await deleteFeedFollow(user.id, feed.id);
    console.log(`User ${user.name} is no longer following feed ${feed.name}`);
    return 0;
}
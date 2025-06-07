import {createFeedFollow, getFeedByUrl} from "../lib/db/queries/feeds_follow_queries";
import { User } from "../lib/db/queries/users";
import {getCurrentUser} from "../utils/get_current_user";

export async function follow(command: string, user: User, url: string) {
    const feed = await getFeedByUrl(url);
    if (!feed) {
        console.log("Feed not found");
        return 1;
    }

    await createFeedFollow(user.id, feed.id);
    console.log(`User ${user.name} is now following feed ${feed.name}`);
    return 0;
}
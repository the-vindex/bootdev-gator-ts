import { getCurrentUser } from "../utils/get_current_user";
import { createFeed } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feeds_follow_queries";
import {User} from "../lib/db/queries/users";

export async function addfeed(cmdname: string, user: User, ...args: string[]) {
    const [name, url] = args;

    const feed = await createFeed(name, url, user.id);
    if (!feed) {
        console.error("Failed to create feed");
        return 1;
    }

    await createFeedFollow(user.id, feed.id);
    console.log(`User ${user.name} is now following feed ${feed.name}`);
    return 0;
}
import {getFeedsWithUser} from "../lib/db/queries/feeds";

export async function feeds(): Promise<number> {
    const feeds = await getFeedsWithUser();
    feeds.forEach(feed => {
        console.log(`* ${feed.feedName} - ${feed.feedUrl} (${feed.username})`);
    })
    return 0;
}

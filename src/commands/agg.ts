import {fetchFeed} from "../rss/rss";
import {getNextFeedToFetch, markFeedAsFetched} from "../lib/db/queries/feeds";
import {formatDuration, parseDuration} from "../utils/duration_parsing";
import {createPost, DuplicatePostError} from "../lib/db/queries/posts";

export async function agg(commandName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("No duration specified.");
    }

    const duration = args[0];
    const durationMs = parseDuration(duration);

    console.log("Scraping feeds every", formatDuration(durationMs));

    const handleError = (error: Error) => {
        throw error;
    };

    scrapeFeeds().catch(handleError)

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, durationMs);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });

    return 0;
}

function unescapeAmpCharacters(str: string) {
    return str?.replace(/&amp;/g, '&')?.replace(/&lt;/g, '<')?.replace(/&gt;/g, '>')?.replace(/&quot;/g, '"')?.replace(/&ndash;/g, "–")?.replace(/&mdash;/g, "--")?.replace(/&hellip;/g, "...")?.replace(/&rsquo;/g, "'");
}

export async function scrapeFeeds() {
    const feedToFetch = await getNextFeedToFetch();
    console.log("Fetching feed ", feedToFetch.url);
    console.debug(feedToFetch);

    await markFeedAsFetched(feedToFetch.id);
    const fetchedFeed = await fetchFeed(feedToFetch.url);
    const feedItems = fetchedFeed.channel.item;

    if (feedItems.length > 0) {
        console.log(`Found ${feedItems.length} items`);
        for (const item of feedItems) {
            try {
                await createPost({
                    title: item.title,
                    url: item.link,
                    description: unescapeAmpCharacters(item.description ?? ""),
                    published_at: item.pubDate ? new Date(item.pubDate) : null,
                    feed_id: feedToFetch.id
                });
            } catch (error) {
                if (error instanceof DuplicatePostError){
                    console.warn(error.message);
                } else {
                    throw error;
                }
            }
            //TODO ignore duplicate URL errors
        }
    }

}
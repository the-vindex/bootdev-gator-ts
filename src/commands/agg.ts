import {fetchFeed} from "../../rss/rss";

export async function agg(commandName: string, ...args: string[]) {
    if (args.length === 0) {
        console.warn("No URL specified, defaulting to https://www.wagslane.dev/index.xml");
        args.push("https://www.wagslane.dev/index.xml");
        return 1;
    }

    const url = args[0];
    const channel = await fetchFeed(url);

    console.log(channel);

    return 0;
}
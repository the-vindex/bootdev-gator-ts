import {XMLParser} from "fast-xml-parser";

export async function fetchFeed(url: string): Promise<RSSFeed> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/rss+xml',
            'User-Agent': 'Gator'
        }
    });

    const text = await response.text();
    const options = {
      isArray: (tagName: string) => tagName === 'item',
    };
    const parsedXml = new XMLParser(options).parse(text);

    const result  = {
        channel: {
            title: parsedXml.rss.channel.title,
            link: parsedXml.rss.channel.link,
            description: parsedXml.rss.channel.description,
            item: [] as RSSItem[]
        }
    } as RSSFeed;


    const items = parsedXml.rss.channel.item;
    if (Array.isArray(items)) {
        for (const item of items) {
            if (item.title !== undefined && item.link !== undefined && item.description !== undefined && item.pubDate !== undefined) {
                // console.log(item);
                const rssItem = {
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    pubDate: item.pubDate
                }
                result.channel.item.push(rssItem);
            }
        }
    }

    return result;
}

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

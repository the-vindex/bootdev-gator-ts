//@ts-ignore
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {fetchFeed} from "../src/rss/rss";

describe('RSS Reader Tests', () => {
    it('should parse RSS feed', async () => {
        const feed = await fetchFeed('https://www.wagslane.dev/index.xml');
        const channel = feed.channel;

        expect(channel.title).toBe("Lane's Blog");
        expect(channel.link).toBe("https://wagslane.dev/");
        expect(channel.description).toBe("Recent content on Lane's Blog")
        expect(channel.item.length).to.be.greaterThan(0);
    })

})
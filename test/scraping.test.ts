import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest'
import {scrapeFeeds} from "../src/commands/agg";
import fs from "node:fs";
import {createUser, deleteUsers} from "../src/lib/db/queries/users";
import path from 'node:path';
import {getPostsForUser} from "../src/lib/db/queries/posts";
import {createFeed} from "../src/lib/db/queries/feeds";
import {runCommandFromArgs} from "../src/commands_execution";

describe('scraping', () => {

    beforeEach(async () => {
        await deleteUsers();
    });

    afterEach(async () => {
        vi.resetAllMocks();
    });

    it("should be able to scrape feed", async () => {
        const user = await createUser('test-user')
        // noinspection JSUnusedLocalSymbols
        const feed = await createFeed('test-feed', 'http://example.com', user.id)
        await runCommandFromArgs('login', user.name);

        //load XML file rss.xml from file
        const testDataPath = path.join(__dirname, '../test-resources/rss.xml');
        const RSS_XML = fs.readFileSync(testDataPath, 'utf-8');

        global.fetch = vi.fn().mockResolvedValue({
            text: () => Promise.resolve(RSS_XML)
        });


        await scrapeFeeds();
        const posts = await getPostsForUser(user.id, 100);

        expect(posts, "Should have posts in DB after importing test data").length(2);

        const firstPost = posts[0];
        expect(firstPost.title).toBe("The Zen of Proverbs");
        expect(firstPost.url).toBe("https://wagslane.dev/posts/zen-of-proverbs/");
        expect(firstPost.description).toBe("20 rules of thumb for writing better software.\nOptimize for simplicity first Write code for humans, not computers Reading is more important than writing Any style is fine, as long as it's black There should be one way to do it, but seriously this time Hide the sharp knives Changing the rules is better than adding exceptions Libraries are better than frameworks Transitive dependencies are a problem Dynamic runtime dependencies are a bigger problem API surface area is a liability Returning early is a good thing Use more plain text Compiler errors are better than runtime errors Runtime errors are better than bugs Tooling is better than documentation Documentation is better than nothing Configuration sucks, but so does convention The cost of building a feature is its smallest cost Types are one honking great idea – let's do more of those!");
        expect(firstPost.published_at).toEqual(new Date("2023-01-08T00:00:00.000Z"));

        /*
         *     <item>
         *       <title>The Zen of Proverbs</title>
         *       <link>https://wagslane.dev/posts/zen-of-proverbs/</link>
         *       <pubDate>Sun, 08 Jan 2023 00:00:00 +0000</pubDate>
         *
         *       <guid>https://wagslane.dev/posts/zen-of-proverbs/</guid>
         *       <description>20 rules of thumb for writing better software.
         * Optimize for simplicity first Write code for humans, not computers Reading is more important than writing Any style is fine, as long as it&amp;rsquo;s black There should be one way to do it, but seriously this time Hide the sharp knives Changing the rules is better than adding exceptions Libraries are better than frameworks Transitive dependencies are a problem Dynamic runtime dependencies are a bigger problem API surface area is a liability Returning early is a good thing Use more plain text Compiler errors are better than runtime errors Runtime errors are better than bugs Tooling is better than documentation Documentation is better than nothing Configuration sucks, but so does convention The cost of building a feature is its smallest cost Types are one honking great idea &amp;ndash; let&amp;rsquo;s do more of those!</description>
         *     </item>
         */


    });

});

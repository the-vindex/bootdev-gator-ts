import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest'
import {scrapeFeeds} from "../src/commands/agg";
import fs from "node:fs";
import {createUser, deleteUsers, User} from "../src/lib/db/queries/users";
import path from 'node:path';
import {getPostsForUser} from "../src/lib/db/queries/posts";
import {createFeed} from "../src/lib/db/queries/feeds";
import {runCommandFromArgs} from "../src/commands_execution";

function mockFetchResult(pathToFile: string) {
    const testDataPath = path.join(__dirname, pathToFile);
    const RSS_XML = fs.readFileSync(testDataPath, 'utf-8');

    global.fetch = vi.fn().mockResolvedValue({
        text: () => Promise.resolve(RSS_XML)
    });
}

describe('scraping', () => {

    let user: User;

    beforeEach(async () => {
        await deleteUsers();
        user = await createUser('test-user')
        // noinspection JSUnusedLocalSymbols
        const feed = await createFeed('test-feed', 'http://example.com', user.id)
        await runCommandFromArgs('login', user.name);
    });

    afterEach(async () => {
        vi.resetAllMocks();
    });

    it("Should scrape multiple items", async () => {
        //load XML file rss.xml from file
        mockFetchResult('../test-resources/rss.xml');
        await scrapeFeeds();

        const posts = await getPostsForUser(user.id, 100);
        expect(posts, "Should have posts in DB after importing test data").length(2);
    });

    it("Should correctly map feed attributes to post", async () => {
        mockFetchResult('../test-resources/rss-singleItem.xml');
        await scrapeFeeds();

        const posts = await getPostsForUser(user.id, 100);
        expect(posts, "Should have posts in DB after importing test data").length(1);

        const firstPost = posts[0];
        expect(firstPost.title).toBe("The Zen of Proverbs");
        expect(firstPost.url).toBe("https://wagslane.dev/posts/zen-of-proverbs/");
        expect(firstPost.description).toBe("20 rules of thumb for writing better software.\nOptimize for simplicity first Write code for humans, not computers Reading is more important than writing Any style is fine, as long as it's black There should be one way to do it, but seriously this time Hide the sharp knives Changing the rules is better than adding exceptions Libraries are better than frameworks Transitive dependencies are a problem Dynamic runtime dependencies are a bigger problem API surface area is a liability Returning early is a good thing Use more plain text Compiler errors are better than runtime errors Runtime errors are better than bugs Tooling is better than documentation Documentation is better than nothing Configuration sucks, but so does convention The cost of building a feature is its smallest cost Types are one honking great idea – let's do more of those!");
        expect(firstPost.published_at).toEqual(new Date("2023-01-08T00:00:00.000Z"));
    });

    it("Should ignore duplicate items", async () => {
        mockFetchResult('../test-resources/rss-duplicate-url.xml');
        await scrapeFeeds();

        const posts = await getPostsForUser(user.id, 100);
        expect(posts, "Should have only 1 post, as second one has duplicate URL").length(1);
    })

});

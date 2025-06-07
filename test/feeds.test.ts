import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {runCommandFromArgs} from "../src/commands_execution";
import {createUser,} from "../src/lib/db/queries/users";
import {getFeeds, getFeedsWithUser} from "../src/lib/db/queries/feeds";
import {login} from "../src/commands/login";
import {getFeedFollowsForUser} from "../src/lib/db/queries/feeds_follow_queries";
import {createTwoUsersWithFeeds} from "./util/testDataFactory";

describe('Feeds tests', () => {

    beforeEach(async () => {
        await runCommandFromArgs('reset');
    });

    afterEach(async () => {
       vi.resetAllMocks();
    });

    it("Should create a feed, we can find it in DB and we automatically follow it", async () => {
        const targetFeedUrl = "https://www.wagslane.dev/index.xml";


        const user1 = await createUser('testuser');
        await runCommandFromArgs('login', 'testuser');
        await runCommandFromArgs('addfeed', "testfeed", targetFeedUrl);

        const allFeeds = await getFeeds();
        const wantedFeeds = allFeeds.filter((feed) => {
            return feed.name === "testfeed"
        });
        expect(wantedFeeds).length(1);

        const myFeedFollows = await getFeedFollowsForUser(user1.id);
        expect(myFeedFollows).length(1);
        expect(myFeedFollows[0].feedUrl).toBe(targetFeedUrl);
    });

    it("Should read all feeds from DB", async () => {
        const user1 = await createUser('testuser');
        await runCommandFromArgs('login', 'testuser');
        await runCommandFromArgs('addfeed', "testfeed", "https://www.wagslane.dev/index1.xml");
        await runCommandFromArgs('addfeed', "testfeed2", "https://www.wagslane.dev/index2.xml");


        await createUser('testuser2');
        await runCommandFromArgs('login', 'testuser2');
        await runCommandFromArgs('addfeed', "testfeed3", "https://www.wagslane.dev/index3.xml");

        const allFeeds = await getFeedsWithUser();
        expect(allFeeds).length(3);

        const user1Feeds = await getFeedsWithUser(user1.id);
        expect(user1Feeds).length(2);

        let count = 0;
        vi.spyOn(console, "log").mockImplementation((data: string[]) => {
            if (data[0].includes("*")){
                count++;
            }
        });

        await runCommandFromArgs('feeds');
        expect(count).toBe(3);
    })

    it("Should follow other people feeds", async () => {
        const {t, user1, user2} = await createTwoUsersWithFeeds();


        await runCommandFromArgs('follow', t.user1FeedUrl);

        const feedFollows = await getFeedFollowsForUser(user2.id);
        expect(feedFollows).length(2);
        expect(feedFollows[0].feedUrl).toBe(t.user2FeedUrl);
        expect(feedFollows[1].feedUrl).toBe(t.user1FeedUrl);

    });
});
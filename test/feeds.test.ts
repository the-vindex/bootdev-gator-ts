import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {runCommandFromArgs} from "../src/commands_execution";
import {createUser,} from "../src/lib/db/queries/users";
import {
    createFeed,
    getFeeds,
    getFeedsWithUser,
    getNextFeedToFetch,
    markFeedAsFetched
} from "../src/lib/db/queries/feeds";
import {getFeedFollowsForUser} from "../src/lib/db/queries/feeds_follow_queries";
import {createTwoUsersWithFeeds} from "./utils/testDataFactory";


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
        // noinspection ES6ShorthandObjectProperty,JSUnusedLocalSymbols
        const {t, user1, user2} = await createTwoUsersWithFeeds();


        await runCommandFromArgs('follow', t.user1FeedUrl);

        const feedFollows = await getFeedFollowsForUser(user2.id);
        expect(feedFollows).length(2);
        expect(feedFollows[0].feedUrl).toBe(t.user2FeedUrl);
        expect(feedFollows[1].feedUrl).toBe(t.user1FeedUrl);

    });

    it("Should allow unfollowing", async () => {
        // noinspection ES6ShorthandObjectProperty,JSUnusedLocalSymbols
        const {t, user1, user2} = await createTwoUsersWithFeeds();

        await runCommandFromArgs('follow', t.user1FeedUrl);
        const followedFeeds = await getFeedFollowsForUser(user2.id);
        expect(followedFeeds).length(2);

        await runCommandFromArgs('unfollow', t.user1FeedUrl);
        const feedsAfterUnfollow = await getFeedFollowsForUser(user2.id);
        expect(feedsAfterUnfollow).length(1);
        expect(feedsAfterUnfollow[0].feedUrl, "Should still follow my own feed").toBe(t.user2FeedUrl);
    })

    it("Should allow feed to be marked as feteched", async () => {
        // noinspection ES6ShorthandObjectProperty,JSUnusedLocalSymbols
        const {t, user1, user2} = await createTwoUsersWithFeeds();

        await runCommandFromArgs('login', user1.name);
        const feedsAfterCreation = await getFeeds();
        const targetFeed = feedsAfterCreation[0];
        expect(targetFeed.last_fetched_at).toBeNull();

        await markFeedAsFetched(feedsAfterCreation[0].id);
        const feedsAfterFetched  = await getFeeds();
        //feed we've updated should have last_fetched_at to be not null
        const targetFeedUpdated = feedsAfterFetched.filter((feed) => {return feed.id === targetFeed.id})[0];
        expect(targetFeedUpdated.last_fetched_at, "Feed we've updated should have last_fetched_at to be not null").not.toBeNull();
        expect(targetFeedUpdated.updatedAt, "Updated time should be different").not.toBe(targetFeed.updatedAt);
        //and the rest should stay null
        expect(feedsAfterFetched.filter((feed) => {return feed.id !== targetFeed.id})[0].last_fetched_at).toBeNull();
    })

    it("should get me next feed to fetch", async () => {
        const user = await createUser('test-user')
        // noinspection ES6ShorthandObjectProperty,JSUnusedLocalSymbols
        await createFeed('test-feed', 'http://example.com', user.id)
        await createFeed('test-feed 2', 'http://example2.com', user.id)
        await runCommandFromArgs('login', user.name)

        const allFeeds = await getFeeds();

        const feedIds = allFeeds.map((feed) => {return feed.id});
        const feedIdsSet = new Set(feedIds);

        //The logic of the test is:
        //- all feeds should have last_fetched_at = null
        //- so get first one, mark it as fetched
        //- request another one - and it should be different than the first one

        const feed1 = await getNextFeedToFetch();
        expect(feedIdsSet).toContain(feed1.id);
        await markFeedAsFetched(feed1.id);
        feedIdsSet.delete(feed1.id);

        const feed2 = await getNextFeedToFetch();
        expect(feedIdsSet, "If we've seen this ID, ordering doesn't work properly").toContain(feed2.id);
        await markFeedAsFetched(feed2.id);
    })

});
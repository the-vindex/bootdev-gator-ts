import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {runCommandFromArgs} from "../src/commands_execution";
import {createUser,} from "../src/lib/db/queries/users";
import {getFeeds, getFeedsWithUser} from "../src/lib/db/queries/feeds";

describe('Feeds tests', () => {

    beforeEach(async () => {
        await runCommandFromArgs('reset');
    });

    afterEach(async () => {
       vi.resetAllMocks();
    });

    it("Should create a feed and we can find it in DB", async () => {
        await createUser('testuser');
        await runCommandFromArgs('login', 'testuser');
        await runCommandFromArgs('addfeed', "testfeed", "https://www.wagslane.dev/index.xml");

        const allFeeds = await getFeeds();
        const wantedFeeds = allFeeds.filter((feed) => {
            return feed.name === "testfeed"
        });

        expect(wantedFeeds).length(1);
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
});
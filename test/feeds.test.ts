import {beforeEach, describe, expect, it} from 'vitest';
import {runCommandFromArgs} from "../src/commands_execution";
import {createUser,} from "../src/lib/db/queries/users";
import {getFeeds} from "../src/lib/db/queries/feeds";

describe('Feeds tests', () => {

    beforeEach(async () => {
        await runCommandFromArgs('reset');
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
});
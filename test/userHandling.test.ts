import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {db} from '../src/lib/db';
import {users} from '../src/lib/db/schema';
import {runCommandFromArgs} from "../src/commands_execution";
import {countUsers, createUser, getUserByName} from "../src/lib/db/queries/users";
import { Config } from '../src/config';
import {createTwoUsersWithFeeds} from "./util/testDataFactory";

function logout() {
    Config.readConfig().setUser("");
}

describe('User Handling Tests', () => {

    beforeEach(async () => {
        await runCommandFromArgs('reset');
    })

    it("addfeed throws exception if not logged in", async () => {
        logout();
        await createUser('testuser');
        await expect(runCommandFromArgs('addfeed', "testfeed", "https://www.wagslane.dev/index.xml")).rejects.toThrowError(/You must be logged in/);
    });

    it("follow throws exception if not logged in", async () => {
        const {t, user1, user2} = await createTwoUsersWithFeeds();
        logout();

        await expect(runCommandFromArgs('follow', t.user1FeedUrl)).rejects.toThrowError(/You must be logged in/);

    });


    it("following throws exception if not logged in", async () => {
        const {t, user1, user2} = await createTwoUsersWithFeeds();
        logout();

        await expect(runCommandFromArgs('following')).rejects.toThrowError(/You must be logged in/);

    });
});
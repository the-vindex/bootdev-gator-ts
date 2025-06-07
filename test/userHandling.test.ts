import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {db} from '../src/lib/db';
import {users} from '../src/lib/db/schema';
import {runCommandFromArgs} from "../src/commands_execution";
import {countUsers, createUser, getUserByName} from "../src/lib/db/queries/users";
import { Config } from '../src/config';

describe('User Handling Tests', () => {

    beforeEach(async () => {
        await runCommandFromArgs('reset');
    })

    it("Operation depending on logged user throws exception if not logged in", async () => {
        Config.readConfig().setUser("");
        await createUser('testuser');
        await expect(runCommandFromArgs('addfeed', "testfeed", "https://www.wagslane.dev/index.xml")).rejects.toThrowError(/You must be logged in/);
    });
});
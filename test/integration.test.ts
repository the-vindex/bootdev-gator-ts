import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {db} from '../src/lib/db';
import {users} from '../src/lib/db/schema';
import {runCommandFromArgs} from "../src/commands_execution";
import {countUsers, createUser, getUserByName} from "../src/lib/db/queries/users";

describe('Command Integration Tests', () => {
    beforeEach(async () => {
        // Clean up database
        await db.delete(users);

        //config file contains connection string, can't it cleanup, but that's ok for now
    });

    afterEach(async () => {
       vi.resetAllMocks();
    });

    it('should execute login command successfully', async () => {
        await createUser('testuser');
        const exitCode = await runCommandFromArgs('login', 'testuser');
        expect(exitCode).toBe(0);
    });

    it('should throw error if user doesnt exist', async () => {
        await expect(runCommandFromArgs('login', 'testuser')).rejects.toThrow('User does not exist');
    });


    it('should return error code for unknown command', async () => {
        const exitCode = await runCommandFromArgs('unknown');
        expect(exitCode).toBe(1);
    });

    it('should handle empty arguments', async () => {
        const exitCode = await runCommandFromArgs('login');
        expect(exitCode).toBe(1);
    });

    it('should handle registration of a new user', async () => {
        const exitCode = await runCommandFromArgs('register', 'testuser');
        expect(exitCode).toBe(0);

        const userFromDb = await getUserByName('testuser');
        expect(userFromDb.name).toBe('testuser');
    })

    it('should throw error if user exists', async () => {
        const exitCode = await runCommandFromArgs('register', 'testuser');
        expect(exitCode).toBe(0);

        await expect(runCommandFromArgs('register', 'testuser')).rejects.toThrow('User already exists');
    })

    it('should handle deleting all users', async () => {
        await runCommandFromArgs('register', 'testuser');
        expect(await countUsers()).toBe(1);

        const exitCode = await runCommandFromArgs('reset');
        expect(exitCode).toBe(0);
        expect(await countUsers()).toBe(0);
    })
    
    it('should list users from the database', async () => {
        await runCommandFromArgs('register', 'testuser');
        await runCommandFromArgs('register', 'testuser2');
        await runCommandFromArgs('register', 'testuser3');
        await runCommandFromArgs('login', 'testuser2');

        let good = false;
        vi.spyOn(console, "log").mockImplementation((...data) => {
            if (data[0] === '* testuser2 (current)') {
                good = true;
            }
        })
        await runCommandFromArgs('users');

        expect(good).toBeTruthy();
    })


    it('Should loop repeatedly and fetch feeds from DB', async () => {
        await runCommandFromArgs('register', 'testuser');
        await runCommandFromArgs('login', 'testuser');
        await runCommandFromArgs('addfeed', "testfeed", "https://www.wagslane.dev/index.xml");

        const aggPromise = runCommandFromArgs('agg', '2s');

        await new Promise((resolve) => setTimeout(resolve, 5000));

        // If we reached this point, the command is still running (success)
        process.emit('SIGINT');
        await aggPromise;

        expect(true).toBeTruthy();
    }, 15000)
});
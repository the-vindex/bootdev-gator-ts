import {describe, it, expect, beforeEach} from 'vitest';
import {db} from '../src/lib/db';
import {users} from '../src/lib/db/schema';
import {runCommandFromArgs} from "../src/commands_execution";
import {createUser, getUserByName} from "../src/lib/db/queries/users";

describe('Command Integration Tests', () => {
    beforeEach(async () => {
        // Clean up database
        await db.delete(users);

        //config file contains connection string, can't it cleanup, but that's ok for now
    });

    it('should execute login command successfully', async () => {
        await createUser('testuser');
        const exitCode = await runCommandFromArgs('login', ['testuser']);
        expect(exitCode).toBe(0);
    });

    it('should throw error if user doesnt exist', async () => {
        await expect(runCommandFromArgs('login', ['testuser'])).rejects.toThrow('User does not exist');
    });


    it('should return error code for unknown command', async () => {
        const exitCode = await runCommandFromArgs('unknown', []);
        expect(exitCode).toBe(1);
    });

    it('should handle empty arguments', async () => {
        const exitCode = await runCommandFromArgs('login', []);
        expect(exitCode).toBe(1);
    });

    it('should handle registration of a new user', async () => {
        const exitCode = await runCommandFromArgs('register', ['testuser']);
        expect(exitCode).toBe(0);

        const userFromDb = await getUserByName('testuser');
        expect(userFromDb.name).toBe('testuser');
    })

    it('should throw error if user exists', async () => {
        const exitCode = await runCommandFromArgs('register', ['testuser']);
        expect(exitCode).toBe(0);

        await expect(runCommandFromArgs('register', ['testuser'])).rejects.toThrow('User already exists');
    })
});
// tests/example.spec.ts
// ---------------------------------------------------------------
// Vitest integration-test template (TypeScript)
// PostgreSQL  •  Drizzle ORM  •  one TX per test (BEGIN / ROLLBACK)
// ---------------------------------------------------------------


// @ts-ignore
import {beforeAll, afterAll, beforeEach, afterEach, describe, it, expect, vi, test} from 'vitest';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../../../src/lib/db/schema';            // ⬅︎ your generated schema
import {createUser, getUserByName} from "../../../src/lib/db/queries/users";
import { Config } from '../../../src/config';

// --- optional but highly recommended for DB tests ----------------
// Running the test file itself sequentially avoids two tests
// sharing the same connection at the same time.
let client: Client; // PG client for the drizzle() wrapper
let db: ReturnType<typeof drizzle>;


describe('DB connection', () => {

// --- DB connection shared by all tests in this file -------------
    beforeAll(async () => {
        const connectionString = Config.readConfig().dbUrl;

        client = new Client(connectionString);
        await client.connect();  // connect to the PG database

        // drizzle() wraps the pg client and gives typed query helpers
        db = drizzle(client, { schema });

    });

    afterAll(async () => {
        // await client.end();          // close PG connection after the suite
    });

// --- TRANSACTION per test case ----------------------------------
    beforeEach(async () => {
        client.query("delete from users where name like 'Alice%'"); // Clear the users table
    });

    afterEach(async () => {
        // Rollback the transaction after each test
        client.query("delete from users where name like 'Alice%'"); // Clear the users table
    });

    it('creates and reads a user inside a rolled-back TX', async () => {
        const userCreated = await createUser("Alice");
        expect(userCreated?.name).toBe('Alice');

        const userSelected = await getUserByName("Alice");

        expect(userSelected).toStrictEqual(userCreated);
    });

});

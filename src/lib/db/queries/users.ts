import {db} from "..";
import {users} from "../schema";
import {eq} from "drizzle-orm/sql/expressions/conditions";
import {count} from "drizzle-orm/sql/functions/aggregate";

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
    try {
        const [result] = await db.insert(users).values({name: name}).returning();
        return result;
    } catch (error) {
        if (error instanceof Error && error.message.includes('Failed query: insert into "users"')) {
            throw new Error("User already exists");
        }
        throw error;
    }
}

export async function getUserByName(name: string){
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result
}

export async function deleteUsers(){
    try {
        await db.delete(users);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete users: ${error.message}`);
        }
        throw error;
    }
}

export async function countUsers() {
    const result = await db.select({value: count()}).from(users);
    return result[0].value;
}

export async function getUsers() {
    return await db.select().from(users);
}
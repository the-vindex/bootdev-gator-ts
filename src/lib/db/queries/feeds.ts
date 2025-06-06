import {db} from "..";
import {feeds, users} from "../schema";
import {User} from "./users";
import {eq} from "drizzle-orm/sql/expressions/conditions";


export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url:string, user_id: string) {

    try {
        return await db.insert(feeds).values({name: name, url: url, user_id: user_id}).returning();
    } catch (error) {
        if (error instanceof Error && error.message.includes('Failed query: insert into "feeds"')) {
            console.error(`Failed to add feed: ${error.message}`);
        } else {
            throw error;
        }
    }
}

export async function getFeeds() {
    return db.select().from(feeds);
}

export async function getFeedsWithUser(user_id?: string) {
    const query = db.select({
        feedName: feeds.name,
        feedUrl: feeds.url,
        username: users.name
    }).from(feeds).innerJoin(users, eq(feeds.user_id,users.id));

    if (user_id){
        query.where(eq(feeds.user_id, user_id));
    }

    return query;
}

export async function printFeed(feed: Feed, user: User){
    console.log(`Feed ${feed.name} by ${user.name}: (${feed.url})`);
}

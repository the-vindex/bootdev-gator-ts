import {db} from "..";
import {feeds} from "../schema";
import {User} from "./users";


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

export async function printFeed(feed: Feed, user: User){
    console.log(`Feed ${feed.name} by ${user.name}: (${feed.url})`);
}



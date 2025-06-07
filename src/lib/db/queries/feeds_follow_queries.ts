import {db} from "../index";
import {feed_follows, feeds, users} from "../schema";
import {eq} from "drizzle-orm";

export type FeedFollow = typeof feed_follows.$inferSelect;

export async function createFeedFollow(userId: string, feedId: string) {
    const result = await db.insert(feed_follows)
        .values({user_id: userId, feed_id: feedId})
        .returning();

    return result[0];
}

/**
 * Returns list of feeds provided user follows. Result is sorted by creation date of follows.
 * @param userId UUID of user
 */
export async function getFeedFollowsForUser(userId: string) {
    return db.select({
        id: feed_follows.id,
        created_at: feed_follows.created_at,
        updated_at: feed_follows.updated_at,
        userName: users.name,
        feedName: feeds.name,
        feedUrl: feeds.url
    })
        .from(feed_follows)
        .innerJoin(users, eq(feed_follows.user_id, users.id))
        .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
        .where(eq(feed_follows.user_id, userId))
        .orderBy(feed_follows.created_at);
}

export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url));
    return result[0];
}
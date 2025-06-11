import {eq} from "drizzle-orm/sql/expressions/conditions";
import {db} from "..";
import {NewPost, Post} from "../posts";
import {feeds, posts} from "../schema";
import {desc} from "drizzle-orm/sql/expressions/select";

export async function createPost(post: NewPost) {
    // First check if feed exists
    const feedExists = await db.query.feeds.findFirst({
        where: eq(feeds.id, post.feed_id)
    });

    if (!feedExists) {
        throw new Error(`Feed with id ${post.feed_id} does not exist`);
    }


    const [newPost] = await db.insert(posts)
        .values(post)
        .returning();
    
    return newPost;
}

export async function getPostsForUser(
    userId: string,
    limit: number = 50
): Promise<Post[]> {
    return db
        .select({
            id: posts.id,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            published_at: posts.published_at,
            feed_id: posts.feed_id,
            created_at: posts.created_at,
            updated_at: posts.updated_at,
        })
        .from(posts)
        .innerJoin(feeds, eq(posts.feed_id, feeds.id))
        .where(eq(feeds.user_id, userId))
        .orderBy(desc(posts.created_at))
        .limit(limit);
}

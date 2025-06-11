import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/queries/users";

export async function browseCommand(cmdName: string, user: User, limitStr?: string): Promise<number> {
        const limit = limitStr ? parseInt(limitStr, 10) : 2;

    try {
        const posts = await getPostsForUser(user.id, limit);

        if (posts.length === 0) {
            console.log('No posts found for this user.');
            return 0;
        }

        console.log(`Latest ${posts.length} posts:\n`);
        posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`);
            console.log(`   URL: ${post.url}`);
            if (post.description) {
                console.log(`   Description: ${post.description}`);
            }
            console.log(`   Published: ${post.published_at?.toLocaleString() ?? 'Unknown'}\n`);
        });

        return 0;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('An unknown error occurred');
        }
        return 1;
    }
}

import {describe, it, expect, beforeEach} from 'vitest'
import {createPost, getPostsForUser} from '../src/lib/db/queries/posts'
import {createUser} from '../src/lib/db/queries/users'
import {createFeed} from '../src/lib/db/queries/feeds'
import {deleteUsers} from '../src/lib/db/queries/users'

describe('posts', () => {
    beforeEach(async () => {
        await deleteUsers()
    })

    it('should create a post', async () => {
        const user = await createUser('test-user')
        const feed = await createFeed('test-feed', 'http://example.com', user.id)

        if (feed === undefined) throw new Error();

        const post = await createPost({
            title: 'Test Post',
            url: 'http://example.com/post',
            description: 'Test Description',
            published_at: new Date(),
            feed_id: feed.id
        })

        expect(post).toBeDefined()
        expect(post.title).toBe('Test Post')
        expect(post.url).toBe('http://example.com/post')
        expect(post.description).toBe('Test Description')
        expect(post.feed_id).toBe(feed.id)

        const [selectedPost] = await getPostsForUser(user.id, 1);
        expect(selectedPost).toStrictEqual(post);
    })
})
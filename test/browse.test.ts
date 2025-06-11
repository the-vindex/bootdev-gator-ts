import {describe, it, expect, beforeEach} from 'vitest'
import {createPost, getPostsForUser} from '../src/lib/db/queries/posts'
import {createUser, deleteUsers} from '../src/lib/db/queries/users'
import {createFeed} from '../src/lib/db/queries/feeds'
import {runCommandFromArgs} from "../src/commands_execution";

function addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes*60000);
}


describe('browse posts', () => {
    beforeEach(async () => {
        await deleteUsers()
    })

    it('should retrieve posts for a user', async () => {
        const user = await createUser('test-user')
        const feed = await createFeed('test-feed', 'http://example.com', user.id)

        if (feed === undefined) throw new Error();

        // noinspection JSUnusedLocalSymbols
        const post1 = await createPost({
            title: 'Test Post 1',
            url: 'http://example.com/post1',
            description: 'Test Description 1',
            published_at: addMinutes(new Date(), 2),
            feed_id: feed.id
        })


        // noinspection JSUnusedLocalSymbols
        const post2 = await createPost({
            title: 'Test Post 2',
            url: 'http://example.com/post2',
            description: 'Test Description 2',
            published_at: new Date(),
            feed_id: feed.id
        })

        await runCommandFromArgs('login', user.name);
        await runCommandFromArgs('browse', "10");
    })

    it('should return empty list when user has no posts', async () => {
        const user = await createUser('test-user')
        const posts = await getPostsForUser(user.id)
        expect(posts).toHaveLength(0)
    })
})
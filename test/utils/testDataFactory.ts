import {createUser} from "../../src/lib/db/queries/users";
import {runCommandFromArgs} from "../../src/commands_execution";

export async function createTwoUsersWithFeeds() {
    const t = {
        user1FeedUrl: "https://www.wagslane.dev/index.xml?1",
        user2FeedUrl: "https://www.wagslane.dev/index.xml?2",
        user1Name: 'testuser1',
        user2Name: 'testuser2'
    };

    const user1 = await createUser(t.user1Name);
    await runCommandFromArgs('login', t.user1Name);
    await runCommandFromArgs('addfeed', "user1_feed1", t.user1FeedUrl);


    const user2 = await createUser(t.user2Name);
    await runCommandFromArgs('login', t.user2Name);
    await runCommandFromArgs('addfeed', "user2_feed1", t.user2FeedUrl);
    return {t, user1, user2};
}
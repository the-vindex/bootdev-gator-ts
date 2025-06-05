import {deleteUsers} from "../lib/db/queries/users";

export async function reset(): Promise<number> {
    try {
        await deleteUsers();
        console.log("Successfully deleted all users");
        return 0;
    } catch (error) {
        console.error("Failed to delete users:", error);
        return 1;
    }
}
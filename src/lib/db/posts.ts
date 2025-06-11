import { type InferInsertModel } from "drizzle-orm";
import { posts } from "./schema";

export type Post = typeof posts.$inferSelect;
export type NewPost = InferInsertModel<typeof posts>;
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { Config } from "../../config";

const config = Config.readConfig();
export const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });

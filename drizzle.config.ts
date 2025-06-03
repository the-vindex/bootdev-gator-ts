import { defineConfig } from "drizzle-kit";
import {Config} from "./src/config";

export default defineConfig({
    schema: "src/schema.ts",
    out: "src/lib/db",
    dialect: "postgresql",
    dbCredentials: {
        url: Config.readConfig().dbUrl,
    },
});

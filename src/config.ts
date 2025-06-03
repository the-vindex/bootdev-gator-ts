import path from "node:path";
import fs from "node:fs";
import * as os from "node:os";

export class Config {
    dbUrl: string;
    currentUserName: String;

    constructor(dbUrl: string, user: String) {
        this.dbUrl = dbUrl;
        this.currentUserName = user;
    }

    setUser(user: String) {
        this.currentUserName = user;
        this.writeConfig();
    }


    writeConfig(){
        const configPath = Config.getConfigPath();
        try{
            fs.writeFileSync(configPath, JSON.stringify({
                db_url: this.dbUrl,
                current_user_name: this.currentUserName
            }, null, 4)); //pretty print
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to write config file: ${error.message}`);
            } else {
                throw error;
            }
        }
    }

    static readConfig(): Config {
        const configPath = this.getConfigPath();
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const configJson: ConfigJson = JSON.parse(configContent);

            return new Config(configJson.db_url, configJson.current_user_name ?? "")

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to read config file: ${error.message}`);
            } else {
                throw error;
            }
        }
    }

    private static getConfigPath() {
        return path.join(os.homedir(), `.gatorconfig.json`);
    }
}

type ConfigJson = {
    db_url: string;
    current_user_name?: string;
}
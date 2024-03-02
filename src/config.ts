import dotenv from "dotenv";
import { settings } from "./data/data";

// Load environment variables
dotenv.config();

// Get environment variables
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

// Check if environment variables are set and if task channel id is set
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables.");
} else if (!settings.taskChannelId) {
  throw new Error("Missing task channel id in settings. (/src/data/data.ts) Keep in mind task channel must be text channel.");
}

// Export config
export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
};
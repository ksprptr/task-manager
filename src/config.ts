import dotenv from 'dotenv';
import { Settings } from './utils/types/global-types';

// Load environment variables
dotenv.config();

// Get environment variables
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

// Create settings
export const settings: Settings = {
  taskChannelId: '',
  lastMessageId: '',
};

// Validation
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error('Missing environment variables.');
} else if (!settings.taskChannelId) {
  throw new Error(
    'Missing task channel id in the config! Keep in mind that task channel must be a text channel.'
  );
}

// Export config
export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  taskChannelId: settings.taskChannelId,
};

import { config } from './config';
import { getData } from './utils/functions/global-functions';
import { Client, GatewayIntentBits } from 'discord.js';

/**
 * Create a Discord client
 */
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

/**
 * Register events
 */
const events = getData('events');

for (const event of events) {
  const { name, execute } = event.data;

  client.on(name, (...args) => {
    execute(...args);
  });
}

// Login to Discord
client.login(config.APP_TOKEN);

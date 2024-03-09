import { config } from './config';
import { events } from './events';
import { Client, GatewayIntentBits } from 'discord.js';

// Create a new client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/**
 * Register events
 */
for (const event of Object.values(events)) {
  const { name, execute } = event.data;

  client.on(name, (...args) => {
    execute(...args);
  });
}

// Login to Discord
client.login(config.DISCORD_TOKEN);

import { EventType } from '../../utils/types/global-types';
import { deployCommands } from '../../deploy-commands';
import { ActivityType, Client, Events } from 'discord.js';

/**
 * Event representing when a bot is ready
 */
const execute = async (client: Client) => {
  // Get guild id
  let guildId = '';

  // Get guild id
  client.guilds.cache.forEach((g) => {
    guildId = g.id;
  });

  // Set bot activity
  client.user!.setActivity('/help', { type: ActivityType.Watching });

  // Deploy commands
  deployCommands({ guildId: guildId });

  // Log the bot is ready
  console.log('Discord bot is ready! 🤖');
};

// Export data of the event
export const data: EventType = {
  name: Events.ClientReady,
  execute,
};

import { settings } from '../../config';
import { ChannelType, Client } from 'discord.js';

/**
 * Function representing task channel check
 */
export const checkTaskChannel = (client: Client) => {
  // Get a task channel
  const channel = client.channels.cache.get(settings.taskChannelId);

  // Validation
  if (!channel) {
    throw new Error(
      'Task channel not found. Check settings in /src/data/data.ts (taskChannelId). Keep in mind task channel must be text channel.'
    );
  } else if (channel && channel.type !== ChannelType.GuildText) {
    throw new Error(
      'Task channel must be text channel. Check settings in /src/data/data.ts (taskChannelId).'
    );
  }
};

/**
 * Function representing if interaction channel is a task channel
 */
export const isTaskChannel = (channelId: string) => {
  return channelId === settings.taskChannelId;
};

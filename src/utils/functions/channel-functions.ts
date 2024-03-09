import { settings } from '../../config';
import { ChannelType, Client } from 'discord.js';

/**
 * Function representing getting a task channel
 */
const getTaskChannel = (client: Client) => {
  // Get a task channel
  const taskChannel = client.channels.cache.get(settings.taskChannelId);

  return taskChannel;
};

/**
 * Function representing deleting last message by id
 */
export const deleteLastMessage = async (client: Client, messageId: string) => {
  // Get a task channel
  const channel = getTaskChannel(client);

  // Validation
  if (!channel) return;
  if (channel.type !== ChannelType.GuildText) return;

  // Get a message
  const message = await channel.messages.fetch(messageId);

  // Delete a message
  message.delete();

  return;
};

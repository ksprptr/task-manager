import { settings } from "../../data/data";
import { ChannelType, Client } from "discord.js";

/**
 * Function to delete the last task message of a task channel
 */
export const deleteLastMessage = async (client: Client, messageId: string) => {
  const channel = getTaskChannel(client);

  if (!channel) return;
  if (channel.type !== ChannelType.GuildText) return;

  const message = await channel.messages.fetch(messageId);
  message.delete();
}

/**
 * Function to get the task channel
 */
const getTaskChannel = (client: Client) => {
  // Get task channel
  const taskChannel = client.channels.cache.get(settings.taskChannelId);
  return taskChannel;
}
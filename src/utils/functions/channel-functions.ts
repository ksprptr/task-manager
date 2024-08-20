import { client } from '../..';
import { getGuildData } from './global-functions';
import { getConceptsEmbed, getTasksEmbed } from './embed-functions';

/**
 * Function to get tasks channel
 */
const getTasksChannel = async () => {
  const guildData = await getGuildData();

  if (!guildData) return;
  if (!guildData.tasksChannelId) return;

  const tasksChannel = client.channels.cache.get(guildData.tasksChannelId);

  if (!tasksChannel?.isTextBased()) return;

  return tasksChannel;
};

/**
 * Function to get concepts channel
 */
const getConceptsChannel = async () => {
  const guildData = await getGuildData();

  if (!guildData) return;
  if (!guildData.conceptsChannelId) return;

  const conceptsChannel = client.channels.cache.get(
    guildData.conceptsChannelId
  );

  if (!conceptsChannel?.isTextBased()) return;

  return conceptsChannel;
};

/**
 * Function to send updated tasks embed
 */
export const sendTasksEmbed = async () => {
  const tasksChannel = await getTasksChannel();

  if (!tasksChannel) return;

  await tasksChannel.send({
    embeds: [await getTasksEmbed()],
  });
};

/**
 * Function to send updated concepts embed
 */
export const sendConceptsEmbed = async () => {
  const conceptsChannel = await getConceptsChannel();

  if (!conceptsChannel) return;

  await conceptsChannel.send({
    embeds: [await getConceptsEmbed()],
  });
};

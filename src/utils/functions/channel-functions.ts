import { client } from '../..';
import { getGuildData } from './global-functions';

/**
 * Function to get tasks channel by id
 */
export const getTasksChannel = async () => {
  const guildData = await getGuildData();

  if (!guildData) return;
  if (!guildData.tasksChannelId) return;

  const tasksChannel = client.channels.cache.get(guildData.tasksChannelId);

  if (!tasksChannel?.isTextBased()) return;

  return tasksChannel;
};

/**
 * Function to get concepts channel by id
 */
export const getConceptsChannel = async () => {
  const guildData = await getGuildData();

  if (!guildData) return;
  if (!guildData.conceptsChannelId) return;

  const conceptsChannel = client.channels.cache.get(
    guildData.conceptsChannelId
  );

  if (!conceptsChannel?.isTextBased()) return;

  return conceptsChannel;
};

import prisma from '../prisma/prisma-client';
import { getStatus } from './status-functions';
import { getGuildData } from './global-functions';
import {
  Colors,
  EmbedField,
  EmbedBuilder,
  EmbedFooterOptions,
} from 'discord.js';

/**
 * Function representing error embed
 */
export const errorEmbed = (title: string, description?: string) => {
  const embed = new EmbedBuilder().setColor(Colors.Red).setTitle(title);

  if (description) embed.setDescription(description);

  return embed;
};

/**
 * Function representing success embed
 */
export const successEmbed = (title: string, description?: string) => {
  const embed = new EmbedBuilder().setColor(Colors.Green).setTitle(title);

  if (description) embed.setDescription(description);

  return embed;
};

/**
 * Function representing normal embed
 */
export const normalEmbed = (
  title: string,
  description?: string,
  fields?: EmbedField[],
  footer?: EmbedFooterOptions,
  timeStamp: boolean = false
) => {
  const embed = new EmbedBuilder({
    title: title,
    description: description,
  }).setColor(Colors.Blurple);

  if (timeStamp) embed.setTimestamp();
  if (fields) fields.forEach((field) => embed.addFields(field));
  if (footer) embed.setFooter(footer);

  return embed;
};

/**
 * Function to get tasks embed
 */
export const getTasksEmbed = async () => {
  const guildData = await getGuildData();
  const tasks = await prisma.task.findMany({
    where: {
      guildId: guildData?.guildId,
    },
  });

  return normalEmbed(
    'Active Tasks',
    `${tasks.length === 0 ? '\n\nNo tasks found.' : ''}`,
    tasks.map((task) => ({
      name: `${task.title} | ${getStatus(task.status)}`,
      value: `**Description:** ${task.description}\n**Assigned To:** ${
        task.assignedTo ? `<@${task.assignedTo}>` : 'No one'
      }\n**ID:** ${task.id}`,
      inline: false,
    })),
    {
      text: `Total Tasks: ${tasks.length}`,
    },
    true
  );
};

/**
 * Function to get concepts embed
 */
export const getConceptsEmbed = async () => {
  const guildData = await getGuildData();
  const concepts = await prisma.concept.findMany({
    where: {
      guildId: guildData?.guildId,
    },
  });

  return normalEmbed(
    'Active Concepts',
    `${concepts.length === 0 ? '\n\nNo concepts found.' : ''}`,
    concepts.map((concept) => ({
      name: `🧠 ${concept.title}`,
      value: `**Description:** ${concept.description}\n**ID:** ${concept.id}`,
      inline: false,
    })),
    {
      text: `Total Concepts: ${concepts.length}`,
    },
    true
  );
};

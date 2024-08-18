import prisma from '../../utils/prisma/prisma-client';
import { getGuildData } from '../../utils/functions/global-functions';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import {
  getTasksChannel,
  getConceptsChannel,
} from '../../utils/functions/channel-functions';
import {
  successEmbed,
  getTasksEmbed,
  getConceptsEmbed,
} from '../../utils/functions/embed-functions';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a clear command
 */
export const execute = async (interaction: CommandInteraction) => {
  const type = interaction.options.get('type')?.value?.toString();
  const guildData = await getGuildData();

  if (!guildData) return;

  const tasks = await prisma.task.findMany({
    where: {
      guildId: guildData.guildId,
    },
  });
  const concepts = await prisma.concept.findMany({
    where: {
      guildId: guildData.guildId,
    },
  });
  const tasksChannel = await getTasksChannel();
  const conceptsChannel = await getConceptsChannel();

  try {
    if (!type) {
      tasks.forEach(async (task) => {
        await prisma.task.delete({
          where: {
            id: task.id,
          },
        });
      });

      concepts.forEach(async (concept) => {
        await prisma.concept.delete({
          where: {
            id: concept.id,
          },
        });
      });

      await tasksChannel?.send({
        embeds: [await getTasksEmbed()],
      });

      await conceptsChannel?.send({
        embeds: [await getConceptsEmbed()],
      });

      return await interaction.reply({
        embeds: [successEmbed('Entries have been cleared!')],
        ephemeral: true,
      });
    } else if (type === 'task') {
      tasks.forEach(async (task) => {
        await prisma.task.delete({
          where: {
            id: task.id,
          },
        });
      });

      tasksChannel?.send({
        embeds: [await getTasksEmbed()],
      });

      return await interaction.reply({
        embeds: [successEmbed('Tasks have been cleared!')],
        ephemeral: true,
      });
    } else if (type === 'concept') {
      concepts.forEach(async (concept) => {
        await prisma.concept.delete({
          where: {
            id: concept.id,
          },
        });
      });

      conceptsChannel?.send({
        embeds: [await getConceptsEmbed()],
      });

      return await interaction.reply({
        embeds: [successEmbed('Concepts have been cleared!')],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);

    return await interaction.reply({
      embeds: [defaultErrorEmbed],
      ephemeral: true,
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear the entries.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('Type of entry to clear.')
      .setRequired(false)
      .addChoices([
        { name: 'Task', value: 'task' },
        { name: 'Concept', value: 'concept' },
      ])
  );

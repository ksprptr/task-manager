import prisma from '../../utils/prisma/prisma-client';
import { Status } from '@prisma/client';
import { successEmbed } from '../../utils/functions/embed-functions';
import { getGuildData } from '../../utils/functions/global-functions';
import {
  sendTasksEmbed,
  sendConceptsEmbed,
} from '../../utils/functions/channel-functions';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import {
  defaultErrorEmbed,
  tasksChannelMissingEmbed,
  conceptsChannelMissingEmbed,
} from '../../utils/data/embed-data';

/**
 * Command representing a create command
 */
export const execute = async (interaction: CommandInteraction) => {
  const type = interaction.options.get('type')?.value?.toString();
  const title = interaction.options.get('title')?.value?.toString();
  const description = interaction.options.get('description')?.value?.toString();

  if (!type || !title || !description) {
    return;
  }

  const guildData = await getGuildData();

  if (!guildData) return;

  if (
    type === 'task' ? !guildData.tasksChannelId : !guildData.conceptsChannelId
  ) {
    return await interaction.reply({
      embeds: [
        type === 'task'
          ? tasksChannelMissingEmbed
          : conceptsChannelMissingEmbed,
      ],
      ephemeral: true,
    });
  }

  try {
    if (type === 'task') {
      await prisma.task.create({
        data: {
          guildId: guildData.guildId,
          title,
          description,
          status: Status.OPEN,
        },
      });

      await sendTasksEmbed();
    } else {
      await prisma.concept.create({
        data: {
          guildId: guildData.guildId,
          title,
          description,
        },
      });

      await sendConceptsEmbed();
    }

    return await interaction.reply({
      embeds: [successEmbed(`${type} has been created!`)],
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);

    return await interaction.reply({
      embeds: [defaultErrorEmbed],
      ephemeral: true,
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create a new entry.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('Type of the entry.')
      .setRequired(true)
      .addChoices([
        { name: 'Task', value: 'task' },
        { name: 'Concept', value: 'concept' },
      ])
  )
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('Title of the entry.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Description of the entry.')
      .setRequired(true)
  );

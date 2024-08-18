import prisma from '../../utils/prisma/prisma-client';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import {
  getTasksChannel,
  getConceptsChannel,
} from '../../utils/functions/channel-functions';
import {
  getGuildData,
  capitalizeFirstLetter,
} from '../../utils/functions/global-functions';
import {
  errorEmbed,
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
 * Command representing an update command
 */
export const execute = async (interaction: CommandInteraction) => {
  const type = interaction.options.get('type')?.value?.toString();
  const id = interaction.options.get('id')?.value?.toString();
  const title = interaction.options.get('title')?.value?.toString();
  const description = interaction.options.get('description')?.value?.toString();

  if (!type || !id) {
    return;
  }

  if (!title && !description) {
    return await interaction.reply({
      embeds: [
        errorEmbed(
          'Invalid input!',
          'Please provide a title or description to update.'
        ),
      ],
      ephemeral: true,
    });
  }

  const guildData = await getGuildData();

  if (!guildData) return;

  try {
    const entry =
      type === 'task'
        ? await prisma.task.findFirst({
            where: {
              id: parseInt(id),
              guildId: guildData.guildId,
            },
          })
        : await prisma.concept.findFirst({
            where: {
              id: parseInt(id),
              guildId: guildData.guildId,
            },
          });

    if (!entry) {
      return await interaction.reply({
        embeds: [errorEmbed(`${capitalizeFirstLetter(type)} not found!`)],
        ephemeral: true,
      });
    }

    if (type === 'task') {
      await prisma.task.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: title,
          description: description,
        },
      });
    } else {
      await prisma.concept.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: title,
          description: description,
        },
      });
    }

    const channel =
      type === 'task' ? await getTasksChannel() : await getConceptsChannel();

    await channel?.send({
      embeds: [
        type === 'task' ? await getTasksEmbed() : await getConceptsEmbed(),
      ],
    });

    await interaction.reply({
      embeds: [
        successEmbed(`${capitalizeFirstLetter(type)} has been updated!`),
      ],
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);

    await interaction.reply({
      embeds: [defaultErrorEmbed],
      ephemeral: true,
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('update')
  .setDescription('Update an entry.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('The type of entry to update.')
      .setRequired(true)
      .addChoices([
        { name: 'Task', value: 'task' },
        { name: 'Concept', value: 'concept' },
      ])
  )
  .addStringOption((option) =>
    option
      .setName('id')
      .setDescription('The ID of the entry to update.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('The title of the entry to update.')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('The description of the entry to update.')
      .setRequired(false)
  );

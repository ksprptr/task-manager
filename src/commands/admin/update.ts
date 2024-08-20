import prisma from '../../utils/prisma/prisma-client';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import {
  errorEmbed,
  successEmbed,
} from '../../utils/functions/embed-functions';
import {
  sendTasksEmbed,
  sendConceptsEmbed,
} from '../../utils/functions/channel-functions';
import {
  getGuildData,
  capitalizeFirstLetter,
} from '../../utils/functions/global-functions';
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

  if (!type || !id) return;
  if (!title && !description) {
    return await interaction.reply({
      embeds: [
        errorEmbed(
          'Invalid input!',
          'Please provide a title or description to update the entry.'
        ),
      ],
      ephemeral: true,
    });
  }

  const guildData = await getGuildData();

  if (!guildData) return;

  const entry =
    type === 'task'
      ? await prisma.task.findFirst({
          where: { id, guildId: guildData.guildId },
        })
      : await prisma.concept.findFirst({
          where: { id, guildId: guildData.guildId },
        });

  if (!entry) {
    return await interaction.reply({
      embeds: [
        errorEmbed(
          `${capitalizeFirstLetter(type)} not found!`,
          'Please provide a valid ID.'
        ),
      ],
      ephemeral: true,
    });
  }

  try {
    if (type === 'task') {
      await prisma.task.update({
        where: { id },
        data: { title: title, description: description },
      });

      await sendTasksEmbed();
    } else {
      await prisma.concept.update({
        where: { id },
        data: { title: title, description: description },
      });

      await sendConceptsEmbed();
    }

    return await interaction.reply({
      embeds: [
        successEmbed(
          `${capitalizeFirstLetter(type)} updated!`,
          `You have updated the ${type}.`
        ),
      ],
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
  .setName('update')
  .setDescription('Update an entry.')
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
    option.setName('id').setDescription('ID of the entry.').setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('Title of the entry.')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Description of the entry.')
      .setRequired(false)
  );

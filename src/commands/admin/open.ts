import prisma from '../../utils/prisma/prisma-client';
import { Status } from '@prisma/client';
import { getGuildData } from '../../utils/functions/global-functions';
import {
  errorEmbed,
  successEmbed,
} from '../../utils/functions/embed-functions';
import {
  sendTasksEmbed,
  sendConceptsEmbed,
} from '../../utils/functions/channel-functions';
import {
  defaultErrorEmbed,
  tasksChannelMissingEmbed,
} from '../../utils/data/embed-data';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing an open command
 */
export const execute = async (interaction: CommandInteraction) => {
  const id = interaction.options.get('id')?.value?.toString();

  if (!id) return;

  const guildData = await getGuildData();

  if (!guildData) return;
  if (!guildData.tasksChannelId) {
    return await interaction.reply({
      embeds: [tasksChannelMissingEmbed],
      ephemeral: true,
    });
  }

  const concept = await prisma.concept.findFirst({
    where: { id, guildId: guildData.guildId },
  });

  if (!concept) {
    return await interaction.reply({
      embeds: [errorEmbed('Concept not found!', 'Please provide a valid ID.')],
      ephemeral: true,
    });
  }

  try {
    await prisma.concept.delete({ where: { id } });

    await prisma.task.create({
      data: {
        id: concept.id,
        guildId: guildData.guildId,
        title: concept.title,
        description: concept.description,
        status: Status.OPEN,
      },
    });

    await sendTasksEmbed();
    await sendConceptsEmbed();

    return await interaction.reply({
      embeds: [
        successEmbed(
          'Concept changed!',
          'You have changed and opened the concept as a new task.'
        ),
      ],
    });
  } catch (error) {
    console.error(error);

    return await interaction.reply({
      embeds: [defaultErrorEmbed],
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('open')
  .setDescription('Open a concept as a new task.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option.setName('id').setDescription('ID of the concept.').setRequired(true)
  );

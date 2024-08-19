import prisma from '../../utils/prisma/prisma-client';
import { getGuildData } from '../../utils/functions/global-functions';
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
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a concept command
 */
export const execute = async (interaction: CommandInteraction) => {
  const id = interaction.options.get('id')?.value?.toString();

  if (!id) return;

  const guildData = await getGuildData();

  if (!guildData) return;

  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(id),
      guildId: guildData.guildId,
    },
  });

  if (!task) {
    return await interaction.reply({
      embeds: [errorEmbed('Task not found!')],
      ephemeral: true,
    });
  }

  try {
    await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });

    await prisma.concept.create({
      data: {
        guildId: guildData.guildId,
        title: task.title,
        description: task.description,
      },
    });

    await sendTasksEmbed();
    await sendConceptsEmbed();

    return await interaction.reply({
      embeds: [successEmbed('Task has been changed to a concept!')],
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
  .setName('concept')
  .setDescription('Change a task to a concept.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  );

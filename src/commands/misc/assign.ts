import prisma from '../../utils/prisma/prisma-client';
import { Status } from '@prisma/client';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import {
  errorEmbed,
  successEmbed,
} from '../../utils/functions/embed-functions';

/**
 * Command representing an assign command
 */
export const execute = async (interaction: CommandInteraction) => {
  const id = interaction.options.get('id')?.value?.toString();
  const user = interaction.options.get('user')?.user;

  if (!id) return;

  const task = await prisma.task.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!task) {
    return await interaction.reply({
      embeds: [errorEmbed('Task not found!')],
      ephemeral: true,
    });
  }

  if (task.status !== Status.OPEN) {
    return await interaction.reply({
      embeds: [errorEmbed('Task is not open or is already assigned!')],
      ephemeral: true,
    });
  }

  try {
    if (!user) {
      await prisma.task.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status: Status.IN_PROGRESS,
          assignedTo: interaction.user.id,
        },
      });

      return await interaction.reply({
        embeds: [successEmbed('Task has been assigned to you!')],
        ephemeral: true,
      });
    }

    await prisma.task.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: Status.IN_PROGRESS,
        assignedTo: user.id,
      },
    });

    return await interaction.reply({
      embeds: [successEmbed(`Task has been assigned to <@${user}>!`)],
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
  .setName('assign')
  .setDescription('Assign a task to a user.')
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  )
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('User to assign the task to.')
      .setRequired(false)
  );

import prisma from '../../utils/prisma/prisma-client';
import { Status } from '@prisma/client';
import { sendTasksEmbed } from '../../utils/functions/channel-functions';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import {
  errorEmbed,
  successEmbed,
} from '../../utils/functions/embed-functions';
import {
  GuildMember,
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a done command
 */
export const execute = async (interaction: CommandInteraction) => {
  const id = interaction.options.get('id')?.value?.toString();
  const member = interaction.member as GuildMember;

  if (!id) return;
  if (isNaN(parseInt(id))) return;

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    return await interaction.reply({
      embeds: [errorEmbed('Task not found!', 'Please provide a valid ID.')],
      ephemeral: true,
    });
  }

  if (
    task.assignedTo !== interaction.user.id &&
    !member.permissions.has(PermissionFlagsBits.Administrator)
  ) {
    return await interaction.reply({
      embeds: [
        errorEmbed(
          'Cannot mark the task as done!',
          'You are not the assignee of the task.'
        ),
      ],
      ephemeral: true,
    });
  }

  if (task.status === Status.DONE) {
    return await interaction.reply({
      embeds: [
        errorEmbed(
          'Cannot mark the task as done!',
          'Task is already marked as done.'
        ),
      ],
      ephemeral: true,
    });
  }

  try {
    await prisma.task.update({
      where: { id },
      data: { status: Status.DONE },
    });

    await sendTasksEmbed();

    return await interaction.reply({
      embeds: [
        successEmbed(
          'Task marked as done!',
          'You have marked the task as done.'
        ),
      ],
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
  .setName('done')
  .setDescription('Mark the task as done.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  );

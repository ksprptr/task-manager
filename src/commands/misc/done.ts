import { Status } from '@prisma/client';
import { getTasksChannel } from '../../utils/functions/channel-functions';
import {
  errorEmbed,
  successEmbed,
  getTasksEmbed,
} from '../../utils/functions/embed-functions';
import prisma from '../../utils/prisma/prisma-client';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a done command
 */
export const execute = async (interaction: CommandInteraction) => {
  const id = interaction.options.get('id')?.value?.toString();

  if (!id) return;
  if (isNaN(parseInt(id))) return;

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

  await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      status: Status.DONE,
    },
  });

  const tasksChannel = await getTasksChannel();

  await tasksChannel?.send({
    embeds: [await getTasksEmbed()],
  });

  await interaction.reply({
    embeds: [successEmbed('Task has been marked as done!')],
  });
};

export const data = new SlashCommandBuilder()
  .setName('done')
  .setDescription('Mark a task as done.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  );

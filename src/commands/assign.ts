import { tasks } from '../data/data';
import { Status } from '../utils/types/global-types';
import { settings } from '../config';
import { isTaskChannel } from '../utils/functions/global-functions';
import { deleteLastMessage } from '../utils/functions/channel-functions';
import { embedField, taskListEmbed } from '../utils/functions/embed-functions';
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

/**
 * Command representing an assign command
 */
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'You are not in task channel!',
          'You can only use this command in the task channel.'
        ),
      ],
      ephemeral: true,
    });
  }

  // Get options
  const id = interaction.options.get('id')?.value;
  const user = interaction.options.get('user')?.user ?? interaction.user;

  // Check for permissions
  if (
    user !== interaction.user &&
    !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
  ) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'No permission!',
          "You don't have permission to assign tasks to other users."
        ),
      ],
      ephemeral: true,
    });
  }

  // Find a task
  const task = tasks.find((taskItem) => taskItem.id === id);

  // Validation
  if (!task) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Task does not exist!',
          `Task with id **${id}** doesn't exist.`
        ),
      ],
      ephemeral: true,
    });
  } else if (task?.status !== Status.OPEN && task?.status !== Status.CONCEPT) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Task is not open and is not a concept!',
          'You can only assign tasks that are open or marked as concept.'
        ),
      ],
      ephemeral: true,
    });
  } else if (task.assignedTo) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Task is already assigned!',
          `This task is already assigned to <@${task.assignedTo.id}>.`
        ),
      ],
      ephemeral: true,
    });
  } else if (user === interaction.client.user) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Cannot assign task to bot!',
          "You can't assign a task to the bot."
        ),
      ],
      ephemeral: true,
    });
  }

  // Assign a task
  task.assignedTo = user;
  task.status =
    task.status === Status.OPEN ? Status.IN_PROGRESS : Status.CONCEPT;

  // Reply with an embed
  if (user === interaction.user) {
    interaction.reply({
      embeds: [
        embedField(
          'success',
          'Task assigned!',
          `You successfully assigned task **${task.title}** with id **${task.id}** to you.`
        ),
      ],
      ephemeral: true,
    });
  } else {
    interaction.reply({
      embeds: [
        embedField(
          'success',
          'Task assigned!',
          `You successfully assigned task **${task.title}** with id **${task.id}** to <@${user?.id}>.`
        ),
      ],
      ephemeral: true,
    });

    // Send a direct message to the user
    user.send({
      embeds: [
        embedField(
          'success',
          'Task assigned!',
          `Task **${task.title}** with id **${task.id}** has been assigned to you. Check what has been assigned to you using \`/info ${task.id}\` in <#${settings.taskChannelId}>`
        ),
      ],
    });
  }

  // Remove last message
  if (settings.lastMessageId) {
    deleteLastMessage(interaction.client, settings.lastMessageId);
  }

  // Send an updated task list
  const updatedTaskList = interaction.channel?.send({
    embeds: [taskListEmbed(tasks)],
  });

  // Update settings
  settings.lastMessageId = (await updatedTaskList)?.id || '';

  return;
}

// Export data of the command
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

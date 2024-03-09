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
 * Command representing a done command
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
  } else if (task.status !== Status.IN_PROGRESS) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Task is not in progress!',
          'You can only mark tasks that are in progress as done.'
        ),
      ],
      ephemeral: true,
    });
  }

  // Mark the task as done
  task.status = Status.DONE;

  // Reply with an embed
  interaction.reply({
    embeds: [
      embedField(
        'success',
        'Task marked as done!',
        `You successfully marked task **${task.title}** with id **${task.id}** as done.`
      ),
    ],
    ephemeral: true,
  });

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
  .setName('done')
  .setDescription('Mark a task as done.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  );

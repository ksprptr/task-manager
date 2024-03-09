import { tasks } from '../../data/data';
import { settings } from '../../config';
import { isTaskChannel } from '../../utils/functions/global-functions';
import { deleteLastMessage } from '../../utils/functions/channel-functions';
import {
  embedField,
  taskListEmbed,
} from '../../utils/functions/embed-functions';
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

/**
 * Command representing a clear command
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

  // Check if there are any tasks
  if (!tasks.length) {
    return interaction.reply({
      embeds: [
        embedField('error', 'No tasks found!', 'There are no tasks to clear.'),
      ],
      ephemeral: true,
    });
  }

  // Clear the tasks
  tasks.splice(0, tasks.length);

  // Reply with an embed
  interaction.reply({
    embeds: [
      embedField(
        'success',
        'Tasks cleared!',
        'You successfully cleared all tasks.'
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
  .setName('clear')
  .setDescription('Clear all tasks.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

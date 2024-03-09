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
 * Command representing a remove command
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
  }

  try {
    // Delete a task
    tasks.splice(tasks.indexOf(task), 1);

    // Reply with an embed
    interaction.reply({
      embeds: [
        embedField(
          'success',
          'Task removed!',
          'You successfully removed a task.'
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
  } catch (error) {
    console.log(error);
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Something went wrong!',
          'There was an error of removing the task. See console for more details.'
        ),
      ],
      ephemeral: true,
    });
  }
}

// Export data of the command
export const data = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Remove a task.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  );

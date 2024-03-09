import { tasks } from '../../data/data';
import { isTaskChannel } from '../../utils/functions/global-functions';
import {
  embedField,
  taskInfoEmbed,
} from '../../utils/functions/embed-functions';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

/**
 * Command representing an info command
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

  // Get a task
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

  // Reply with an embed
  return interaction.reply({ embeds: [taskInfoEmbed(task)], ephemeral: true });
}

// Export data of the command
export const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Info about a task.')
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  );

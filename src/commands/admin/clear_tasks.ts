import { tasks } from "../../data/data";
import { isTaskChannel } from "../../utils/functions/global-functions";
import { errorEmbed, successEmbed, taskListEmbed } from "../../utils/functions/embed-functions";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Clear all tasks.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

/**
 * Command representing the clearing of all tasks
 */
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
  }

  // Check if there are tasks
  if (!tasks.length) {
    return interaction.reply({ embeds: [errorEmbed("404 | Tasks not found", "There are no tasks to clear.")], ephemeral: true });
  }

  // Clear tasks
  tasks.splice(0, tasks.length);

  // Reply
  interaction.reply({ embeds: [successEmbed("200 | Tasks cleared", "You successfully cleared all tasks.")], ephemeral: true });

  // Send updated task list
  return interaction.channel?.send({ embeds: [taskListEmbed(tasks)] });
}
import { tasks } from "../data/data";
import { isTaskChannel } from "../utils/functions/global-functions";
import { errorEmbed, taskInfoEmbed } from "../utils/functions/embed-functions";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Info about a task.")
  .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true))

/**
 * Command representing info about a task
 */
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
  }
  
  // Get option values
  const id = interaction.options.get("id")?.value;

  // Get task
  const task = tasks.find((task) => task.id === id);

  // Validation
  if (!task) {
    return interaction.reply({ embeds: [errorEmbed("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
  }

  // Reply
  return interaction.reply({ embeds: [taskInfoEmbed(task)], ephemeral: true });
}
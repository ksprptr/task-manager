import { tasks } from "../../data/data";
import { isTaskChannel } from "../../utils/functions/global-functions";
import { errorEmbed, taskListEmbed, successEmbed } from "../../utils/functions/embed-functions";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove a task.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true));

/**
 * Command representing the deletion of a task
 */ 
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
  }
  
  // Get option values
  const id = interaction.options.get("id")?.value;

  // Find task
  const task = tasks.find((task) => task.id === id);

  // Validation
  if (!task) {
    return interaction.reply({ embeds: [errorEmbed("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
  }

  try {
    // Delete task
    tasks.splice(tasks.indexOf(task), 1);

    // Reply
    interaction.reply({ embeds: [successEmbed("200 | Task removed", "You successfully removed a task.")], ephemeral: true });

    // Send updated task list
    return interaction.channel?.send({ embeds: [taskListEmbed(tasks)] });
  } catch (error) {
    console.log(error);
    return interaction.reply({ embeds: [errorEmbed("500 | Internal bot error", "There was an error of removing the task. See console for more details.")], ephemeral: true });
  }
}
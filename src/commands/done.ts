import { Status } from "../utils/types/global-types";
import { isTaskChannel } from "../utils/functions/global-functions";
import { settings, tasks } from "../data/data";
import { deleteLastMessage } from "../utils/functions/task-channel-functions";
import { errorEmbed, successEmbed, taskListEmbed } from "../utils/functions/embed-functions";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("done")
  .setDescription("Mark a task as done.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true));

/**
 * Command representing the marking of a task as done
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
  } else if (task.status !== Status.IN_PROGRESS) {
    return interaction.reply({ embeds: [errorEmbed("409 | Task not in progress", "You can only mark tasks that are in progress as done.")], ephemeral: true });
  }

  // Mark task as done
  task.status = Status.DONE;

  // Reply
  interaction.reply({ embeds: [successEmbed("200 | Task marked as done", `You successfully marked task **${task.title}** with id **${task.id}** as done.`)], ephemeral: true });

  // Remove last message
  if (settings.lastMessageId) {
    deleteLastMessage(interaction.client, settings.lastMessageId);
  }

  // Send updated task list
  const updatedTaskList = interaction.channel?.send({ embeds: [taskListEmbed(tasks)] });

  // Update settings
  settings.lastMessageId = (await updatedTaskList)?.id || "";

  return;
}
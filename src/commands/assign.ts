import { Status } from "../utils/types/global-types";
import { isTaskChannel } from "../utils/functions/global-functions";
import { settings, tasks } from "../data/data";
import { deleteLastMessage } from "../utils/functions/task-channel-functions";
import { errorEmbed, successEmbed, taskListEmbed } from "../utils/functions/embed-functions";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("assign")
  .setDescription("Assign a task to a user.")
  .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true))
  .addUserOption((option) => option.setName("user").setDescription("User to assign the task to.").setRequired(false));

/**
 * Command representing the assignment of a task
 */
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
  }
  
  // Get option values
  const id = interaction.options.get("id")?.value;
  const user = interaction.options.get("user")?.user ?? interaction.user;

  // Check for permissions
  if (user !== interaction.user && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You don't have permission to assign tasks to other users.")], ephemeral: true });
  }
  
  // Find task
  const task = tasks.find((task) => task.id === id);

  // Validation
  if (!task) {
    return interaction.reply({ embeds: [errorEmbed("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
  } else if (task?.status !== Status.OPEN) {
    return interaction.reply({ embeds: [errorEmbed("409 | Task not open", "You can only assign tasks that are open.")], ephemeral: true });
  } else if (task.assignedTo) {
    return interaction.reply({ embeds: [errorEmbed("409 | Task already assigned", `This task is already assigned to <@${task.assignedTo.id}>.`)], ephemeral: true });
  }

  // Assign task
  task.assignedTo = user;
  task.status = Status.IN_PROGRESS;

  // Reply
  if (user === interaction.user) {
    interaction.reply({ embeds: [successEmbed("200 | Task assigned", `You successfully assigned task **${task.title}** with id **${task.id}** to you.`)], ephemeral: true });
  } else {
    interaction.reply({ embeds: [successEmbed("200 | Task assigned", `You successfully assigned task **${task.title}** with id **${task.id}** to <@${user?.id}>.`)] , ephemeral: true });

    // Send DM to user
    user.send({ embeds: [successEmbed("200 | Task assigned", `Task **${task.title}** with id **${task.id}** has been assigned to you. Check what task have been assigned to you!`)] });
  }

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

import { tasks } from "../../data/data";
import { Status } from "../../utils/types/global-types";
import { convertStatus } from "../../utils/functions/status-functions";
import { isTaskChannel } from "../../utils/functions/global-functions";
import { errorEmbed, successEmbed, taskListEmbed } from "../../utils/functions/embed-functions";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("edit")
  .setDescription("Edit a task.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true))
  .addStringOption((option) => option.setName("title").setDescription("Title of the task.").setRequired(false))
  .addStringOption((option) => option.setName("description").setDescription("Description of the task.").setRequired(false))
  .addStringOption((option) => option.setName("status").setDescription("Status of the task.").setRequired(false).addChoices({ name: 'Open', value: 'OPEN' }, { name: 'Concept', value: 'CONCEPT' }, { name: 'In progress', value: 'IN_PROGRESS' }, { name: 'Done', value: 'DONE' }))
  .addUserOption((option) => option.setName("assigned-to").setDescription("User to assign the task to. (select bot to assign to no one)").setRequired(false));

/**
 * Command representing the editing of a task
 */
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
  }
  
  // Get option values
  const id = interaction.options.get("id")?.value;
  const title = interaction.options.get("title")?.value;
  const description = interaction.options.get("description")?.value;
  const status = interaction.options.get("status")?.value;
  let assignedTo: User | undefined | "no-one" = interaction.options.get("assigned-to")?.user;

  // Find task
  const task = tasks.find((task) => task.id === id);

  // Validation
  if (!task) {
    return interaction.reply({ embeds: [errorEmbed("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
  } else if (!title && !description && !status && !assignedTo) {
    return interaction.reply({ embeds: [errorEmbed("404 | Change not found", "You need to provide at least one field to update.")], ephemeral: true });
  }

  // Check if assigned to bot
  if (assignedTo && assignedTo === interaction.client.user) {
    assignedTo = "no-one";
  }

  try {
    // Edit task
    const newTask = {
      ...task,
      title: title ? title as string : task.title,
      description: description ? description as string : task.description,
      status: status ? convertStatus(status as string) as Status : task.status,
      assignedTo: assignedTo === "no-one" ? null : assignedTo ? assignedTo : task.assignedTo,
    };
    
    // Validation
    if ((newTask.status === Status.CONCEPT || newTask.status === Status.OPEN) && newTask.assignedTo) {
      return interaction.reply({ embeds: [errorEmbed("400 | Bad request", "You can only change assign of the task with status in progress or done.")], ephemeral: true });
    } else if ((newTask.status === Status.CONCEPT || newTask.status === Status.OPEN) && newTask.assignedTo) {
      return interaction.reply({ embeds: [errorEmbed("400 | Bad request", "You can't change task that already have been assigned.")], ephemeral: true });
    } else if ((newTask.status === Status.IN_PROGRESS || newTask.status === Status.DONE) && !newTask.assignedTo) {
      return interaction.reply({ embeds: [errorEmbed("400 | Bad request", "You can't change status to in progress without assigning the task.")], ephemeral: true });
    }

    // Update task
    tasks[tasks.indexOf(task)] = newTask;

    // Send DM to user if assigned
    if (assignedTo && assignedTo !== "no-one" && newTask.assignedTo !== task.assignedTo && newTask.assignedTo !== interaction.user) {
      return assignedTo.send({ embeds: [successEmbed("200 | Task assigned", `Task **${task.title}** with id **${task.id}** has been assigned to you. Check what task have been assigned to you!`)] });
    }
  
    // Reply
    interaction.reply({ embeds: [successEmbed("200 | Task updated", "You successfully updated a task.")], ephemeral: true });
    
    // Send updated task list
    return interaction.channel?.send({ embeds: [taskListEmbed(tasks)] });
  } catch (error) {
    console.log(error);
    return interaction.reply({ embeds: [errorEmbed("500 | Internal bot error", "There was an error of updating the task. See console for more details.")], ephemeral: true });
  }
}
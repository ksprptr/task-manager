import { tasks } from "../../data/data";
import { Task, Status } from "../../utils/types/global-types";
import { convertStatus } from "../../utils/functions/status-functions";
import { isTaskChannel } from "../../utils/functions/global-functions";
import { errorEmbed, taskListEmbed, successEmbed } from "../../utils/functions/embed-functions";
import { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("create")
  .setDescription("Create a new task.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) => option.setName("status").setDescription("Status of the task.").setRequired(true).addChoices({ name: 'Open', value: 'OPEN' }, { name: 'Concept', value: 'CONCEPT' },))
  .addStringOption((option) => option.setName("title").setDescription("Title of the task.").setRequired(true))
  .addStringOption((option) => option.setName("description").setDescription("Description of the task.").setRequired(true))
  .addStringOption((option) => option.setName("concept").setDescription("Concept message of the task.").setRequired(false));

/**
 * Command representing the creation of a new task
 */
export async function execute(interaction: CommandInteraction) {
  // Check if interaciton channel is a task channel
  if (!isTaskChannel(interaction.channelId)) {
    return interaction.reply({ embeds: [errorEmbed("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
  }
  
  // Get option values
  const id = tasks.length + 1;
  const title = interaction.options.get("title")?.value;
  const statusValue = interaction.options.get("status")?.value;
  const description = interaction.options.get("description")?.value;
  const conceptMessage = interaction.options.get("concept")?.value;
  const isConcept = statusValue === "CONCEPT";

  // Validation
  if (statusValue === "CONCEPT" && !conceptMessage) {
    return interaction.reply({ embeds: [errorEmbed("404 | Concept not found", "You must provide a concept for a concept task.")], ephemeral: true });
  } else if (tasks.find((task) => task.title.toLowerCase() === (title as string).toLowerCase())) {
    return interaction.reply({ embeds: [errorEmbed("409 | Task already exist", "A task with this title already exists.")] , ephemeral: true });
  }

  // Convert status to enum
  const status = convertStatus(statusValue as string);

  try {
    // Create task
    const newTask: Task = {
      id: id,
      title: title as string,
      description: description as string,
      status: status as Status,
      concept: isConcept ? conceptMessage as string : undefined,
      assignedTo: null,
    };

    // Add task to the list
    tasks.push(newTask);

    // Reply with success message
    interaction.reply({ embeds: [successEmbed("201 | Task created", "You successfully created a task.")], ephemeral: true });

    // Send updated task list
    return interaction.channel?.send({ embeds: [taskListEmbed(tasks)] });
  } catch (error) {
    console.log(error);
    return interaction.reply({ embeds: [errorEmbed("500 | Internal bot error", "There was an error of creating the task. See console for more details.")], ephemeral: true });
  }
}
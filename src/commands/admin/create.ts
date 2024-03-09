import { tasks } from '../../data/data';
import { settings } from '../../config';
import { Task, Status } from '../../utils/types/global-types';
import { convertStatus } from '../../utils/functions/status-functions';
import { isTaskChannel } from '../../utils/functions/global-functions';
import { deleteLastMessage } from '../../utils/functions/channel-functions';
import {
  embedField,
  taskListEmbed,
} from '../../utils/functions/embed-functions';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a create command
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
  const id = tasks.length + 1;
  const title = interaction.options.get('title')?.value;
  const statusValue = interaction.options.get('status')?.value;
  const description = interaction.options.get('description')?.value;
  const conceptMessage = interaction.options.get('concept')?.value;
  const isConcept = statusValue === 'CONCEPT';

  // Validation
  if (statusValue === 'CONCEPT' && !conceptMessage) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Concept is required!',
          'You must provide a concept for a concept task.'
        ),
      ],
      ephemeral: true,
    });
  } else if (
    tasks.find(
      (taskItem) =>
        taskItem.title.toLowerCase() === (title as string).toLowerCase()
    )
  ) {
    return interaction.reply({
      embeds: [
        embedField(
          'error',
          'Task already exists!',
          'A task with this title already exists.'
        ),
      ],
      ephemeral: true,
    });
  }

  // Convert a status to enum
  const status = convertStatus(statusValue as string);

  try {
    // Create a new task
    const newTask: Task = {
      id: id,
      title: title as string,
      description: description as string,
      status: status as Status,
      concept: isConcept ? (conceptMessage as string) : undefined,
      assignedTo: null,
    };

    // Add the task to the list
    tasks.push(newTask);

    // Reply with an embed
    interaction.reply({
      embeds: [
        embedField(
          'success',
          'Task created!',
          'You successfully created a task.'
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
          'There was an error of creating the task. See console for more details.'
        ),
      ],
      ephemeral: true,
    });
  }
}

// Export data of the command
export const data = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create a new task.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('status')
      .setDescription('Status of the task.')
      .setRequired(true)
      .addChoices(
        { name: 'Open', value: 'OPEN' },
        { name: 'Concept', value: 'CONCEPT' }
      )
  )
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('Title of the task.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Description of the task.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('concept')
      .setDescription('Concept message of the task.')
      .setRequired(false)
  );

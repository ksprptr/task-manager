import { Task, Status } from '../types/global-types';
import { formatStatus } from './status-functions';
import {
  Colors,
  EmbedBuilder,
  EmbedField,
  EmbedFooterOptions,
} from 'discord.js';

/**
 * Function representing embed creation
 */
export const embedField = (
  type: 'normal' | 'success' | 'error',
  title: string,
  description?: string,
  fields?: EmbedField[],
  footer?: EmbedFooterOptions,
  timeStamp: boolean = false
) => {
  // Create an embed
  const embed = new EmbedBuilder({
    title,
  }).setColor(
    type === 'normal'
      ? Colors.White
      : type === 'success'
      ? Colors.Green
      : Colors.Red
  );

  // Add description if exists
  if (description) {
    embed.setDescription(description);
  }

  // Add fields if exists
  if (fields) {
    embed.addFields(fields);
  }

  // Add footer if exists
  if (footer) {
    embed.setFooter(footer);
  }

  // Add timestamp if needed
  if (timeStamp) {
    embed.setTimestamp();
  }

  return embed;
};

/**
 * Function representing creation of a task info embed
 */
export const taskInfoEmbed = (task: Task) => {
  // Get color based on status
  const getColor = (status: Status) => {
    switch (status) {
      case Status.OPEN:
        return 'Red';
      case Status.IN_PROGRESS:
        return 'Yellow';
      case Status.DONE:
        return 'Green';
      case Status.CONCEPT:
        return 'Purple';
      default:
        return 'Grey';
    }
  };

  // Create an embed
  const embed = new EmbedBuilder({
    title:
      task.title +
      (task.concept && task.status === Status.CONCEPT
        ? ` *(${task.concept})*`
        : ''),
    description: `${task.description}\n\n**ID:** ${
      task.id
    }\n**Status: ** ${formatStatus(task.status)}\n**Assigned To:** ${
      task.assignedTo ? `<@${task.assignedTo.id}>` : 'No one'
    }`,
  }).setColor(getColor(task.status));

  return embed;
};

/**
 * Function representing creation of a task list embed
 */
export const taskListEmbed = (tasks: Task[]) => {
  // Create a description
  let description = '';

  // Check if task list is empty
  if (tasks.length === 0) {
    description += '\nNo tasks found.';
  }

  // Add tasks to the description
  tasks.forEach((task) => {
    description += `\n\n**[${task.id}]** | ${formatStatus(task.status)} | **${
      task.title
    }**${
      task.concept && task.status === Status.CONCEPT
        ? ` *(${task.concept})*`
        : ''
    }\n└~~-~~ Assigned to: ${
      task.assignedTo ? `<@${task.assignedTo.id}>` : 'No one'
    }`;
  });

  // Create an embed
  const embed = new EmbedBuilder({
    title: 'Task List',
    description: description,
  }).setColor(Colors.White);

  return embed;
};

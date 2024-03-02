import { Task, Status } from "../types/global-types";
import { formatStatus } from "./status-functions";
import { EmbedBuilder } from "discord.js";

/**
 * Function representing creation of a task success embed
 */
export const successEmbed = (title: string, message: string) => {
  const embed = new EmbedBuilder({
    title: title,
    description: message,
  }).setColor("Green");

  return embed;
}

/**
 * Function representing creation of an error embed
 */
export const errorEmbed = (title: string, message: string) => {
  const embed = new EmbedBuilder({
    title: title,
    description: message,
  }).setColor("Red");

  return embed;
}

/**
 * Function representing creation of a task info embed
 */
export const taskInfoEmbed = (task: Task) => {
  const getColor = (status: Status) => {
    switch (status) {
      case Status.OPEN:
        return "Red";
      case Status.IN_PROGRESS:
        return "Yellow";
      case Status.DONE:
        return "Green";
      case Status.CONCEPT:
        return "Purple";
      default:
        return "Grey";
    }
  }

  const embed = new EmbedBuilder({
    title: task.title,
    description: `${task.description}\n\n**Status: ** ${formatStatus(task.status)}\n**Assigned To:** ${task.assignedTo ? `@${task.assignedTo.username}` : "No one"}`,
  }).setColor(getColor(task.status));

  return embed;
}

/**
 * Function representing creation of a task list embed
 */
export const taskListEmbed = (tasks: Task[]) => {
  let description = ""

  if (tasks.length === 0) {
    description += "\nNo tasks found.";
  }

  tasks.forEach((task) => {
    description += `\n\n**${task.id}** | ${formatStatus(task.status)} | **${task.title}**${task.concept ? ` *(${task.concept})*` : ""}`;
  });

  const embed = new EmbedBuilder({
    title: "Task List",
    description: description,

  }).setColor("Blue");

  return embed;
}
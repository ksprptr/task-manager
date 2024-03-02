import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

// Export data of command
export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Help about the bot.");

/**
 * Command representing the help command
 */
export async function execute(interaciton: CommandInteraction) {
  // Create embed
  const embed = new EmbedBuilder({
    title: "Help",
    description: "This bot is used to manage tasks. You can create, assign, and mark tasks as done.",
  })
  .addFields({
    name: "Commands",
    value: "You can use the following commands:\n\n`/info` - Get more info about a task\n`/assign` - Assign a task\n`/done` - Mark a task as done\n`/help` - Get help about the bot",
  })
  .setColor("Blue");

  // Add admin commands if user is an admin
  if (interaciton.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    embed.addFields({
      name: "Admin Commands",
      value: "You can use the following commands:\n\n`/create` - Create a task\n`/edit` - Edit a task\n`/remove` - Remove a task\n`/clear` - Clear all tasks",
    });
  }

  // Reply
  return interaciton.reply({ embeds: [embed], ephemeral: true });
}
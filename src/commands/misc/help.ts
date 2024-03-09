import { embedField } from '../../utils/functions/embed-functions';
import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

/**
 * Command representing a help command
 */
export async function execute(interaciton: CommandInteraction) {
  // Create an embed
  const embed = embedField(
    'normal',
    'Help',
    'This bot is used to manage tasks. You can create, assign, and mark tasks as done.',
    [
      {
        name: 'Commands',
        value:
          'You can use the following commands:\n\n`/info` - Get more info about a task\n`/assign` - Assign a task\n`/done` - Mark a task as done\n`/help` - Get help about the bot',
        inline: false,
      },
      {
        name: 'Tasks',
        value:
          'Task format in the task list:\n\n**[id]** | [status] | **Title of the task** *(concept message)*\n└~~-~~ Assigned to: [user]',
        inline: false,
      },
    ]
  );

  // Add the admin commands if user is an admin
  if (interaciton.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    embed.addFields({
      name: 'Admin Commands',
      value:
        'You can use the following commands:\n\n`/create` - Create a task\n`/edit` - Edit a task\n`/remove` - Remove a task\n`/clear` - Clear all tasks',
      inline: false,
    });
  }

  // Reply with an embed
  return interaciton.reply({ embeds: [embed], ephemeral: true });
}

// Export data of the command
export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Help about the bot.');

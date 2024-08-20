import { normalEmbed } from '../../utils/functions/embed-functions';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a help command
 */
export const execute = async (interaciton: CommandInteraction) => {
  const embed = normalEmbed(
    'Help',
    'This bot is used to manage tasks. You can create, assign, and mark tasks as done.',
    [
      {
        name: 'Commands',
        value:
          'You can use the following commands:\n\n`/assign` - Assign a task to yourself\n`/done` - Mark a task as done\n`/help` - Get help about the bot',
        inline: false,
      },
    ]
  );

  if (interaciton.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    embed.addFields({
      name: 'Admin Commands',
      value:
        'You can use the following commands:\n\n`/create` - Create an entry\n`/update` - Update en entry\n`/delete` - Delete an entry\n`/clear` - Clear the entries\n\n`/open` - Open a concept as a new task\n`/concept` - Change a task to the concept\n\n`/setup` - Setup the bot',
      inline: false,
    });
  }

  return interaciton.reply({ embeds: [embed], ephemeral: true });
};

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get help about the bot.');

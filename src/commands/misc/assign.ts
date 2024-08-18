import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

/**
 * Command representing an assign command
 */
export const execute = async (interaction: CommandInteraction) => {
  interaction.reply('Assign command executed!');
};

export const data = new SlashCommandBuilder()
  .setName('assign')
  .setDescription('Assign a task to a user.')
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the task.').setRequired(true)
  )
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('User to assign the task to.')
      .setRequired(false)
  );

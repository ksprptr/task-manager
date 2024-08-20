import prisma from '../../utils/prisma/prisma-client';
import { getGuildData } from '../../utils/functions/global-functions';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import {
  errorEmbed,
  successEmbed,
} from '../../utils/functions/embed-functions';
import {
  sendTasksEmbed,
  sendConceptsEmbed,
} from '../../utils/functions/channel-functions';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a clear command
 */
export const execute = async (interaction: CommandInteraction) => {
  const type = interaction.options.get('type')?.value?.toString();
  const guildData = await getGuildData();

  if (!guildData) return;

  const tasks = await prisma.task.findMany({
    where: { guildId: guildData.guildId },
  });
  const concepts = await prisma.concept.findMany({
    where: { guildId: guildData.guildId },
  });

  try {
    if (!type) {
      if (tasks.length === 0 && concepts.length === 0) {
        return await interaction.reply({
          embeds: [
            errorEmbed(
              'No entries to clear!',
              'There are no entries to clear.'
            ),
          ],
          ephemeral: true,
        });
      }

      tasks.forEach(async (task) => {
        await prisma.task.delete({ where: { id: task.id } });
      });

      concepts.forEach(async (concept) => {
        await prisma.concept.delete({ where: { id: concept.id } });
      });

      await sendTasksEmbed();
      await sendConceptsEmbed();

      return await interaction.reply({
        embeds: [
          successEmbed('Entries cleared!', 'You have cleared all the entries.'),
        ],
        ephemeral: true,
      });
    } else if (type === 'task') {
      tasks.forEach(async (task) => {
        await prisma.task.delete({ where: { id: task.id } });
      });

      await sendTasksEmbed();

      return await interaction.reply({
        embeds: [successEmbed('Tasks cleared!', 'You have cleared all tasks.')],
        ephemeral: true,
      });
    } else if (type === 'concept') {
      concepts.forEach(async (concept) => {
        await prisma.concept.delete({ where: { id: concept.id } });
      });

      await sendConceptsEmbed();

      return await interaction.reply({
        embeds: [
          successEmbed('Concepts cleared!', 'You have cleared all concepts.'),
        ],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);

    return await interaction.reply({
      embeds: [defaultErrorEmbed],
      ephemeral: true,
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear the entries.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('Type of the entry.')
      .setRequired(false)
      .addChoices([
        { name: 'Task', value: 'task' },
        { name: 'Concept', value: 'concept' },
      ])
  );

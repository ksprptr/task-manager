import prisma from '../../utils/prisma/prisma-client';
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
  getGuildData,
  capitalizeFirstLetter,
} from '../../utils/functions/global-functions';
import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing a delete command
 */
export const execute = async (interaction: CommandInteraction) => {
  const type = interaction.options.get('type')?.value?.toString();
  const id = interaction.options.get('id')?.value?.toString();

  if (!type || !id) {
    return;
  }

  const guildData = await getGuildData();

  if (!guildData) return;

  const entry =
    type === 'task'
      ? await prisma.task.findFirst({
          where: {
            id: parseInt(id),
            guildId: guildData.guildId,
          },
        })
      : await prisma.concept.findFirst({
          where: {
            id: parseInt(id),
            guildId: guildData.guildId,
          },
        });

  if (!entry) {
    return await interaction.reply({
      embeds: [errorEmbed(`${capitalizeFirstLetter(type)} not found!`)],
      ephemeral: true,
    });
  }

  try {
    if (type === 'task') {
      await prisma.task.delete({ where: { id: parseInt(id) } });

      await sendTasksEmbed();
    } else {
      await prisma.concept.delete({ where: { id: parseInt(id) } });

      await sendConceptsEmbed();
    }

    return await interaction.reply({
      embeds: [
        successEmbed(`${capitalizeFirstLetter(type)} has been deleted!`),
      ],
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);

    return await interaction.reply({
      embeds: [defaultErrorEmbed],
      ephemeral: true,
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('Delete an entry.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('Type of the entry to delete.')
      .setRequired(true)
      .addChoices([
        { name: 'Task', value: 'task' },
        { name: 'Concept', value: 'concept' },
      ])
  )
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the entry.').setRequired(true)
  );

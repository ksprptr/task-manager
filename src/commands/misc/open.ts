import { Status } from '@prisma/client';
import { getGuildData } from '../../utils/functions/global-functions';
import { defaultErrorEmbed } from '../../utils/data/embed-data';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import {
  getTasksChannel,
  getConceptsChannel,
} from '../../utils/functions/channel-functions';
import {
  errorEmbed,
  successEmbed,
  getTasksEmbed,
  getConceptsEmbed,
} from '../../utils/functions/embed-functions';

/**
 * Command representing an open command
 */
export const execute = async (interaction: CommandInteraction) => {
  const id = interaction.options.get('id')?.value?.toString();

  if (!id) return;

  const guildData = await getGuildData();

  if (!guildData) return;

  try {
    const concept = await prisma.concept.findFirst({
      where: {
        id: parseInt(id),
        guildId: guildData.guildId,
      },
    });

    if (!concept) {
      return await interaction.reply({
        embeds: [errorEmbed('Concept not found!')],
        ephemeral: true,
      });
    }

    await prisma.concept.delete({
      where: {
        id: parseInt(id),
      },
    });

    await prisma.task.create({
      data: {
        guildId: guildData.guildId,
        title: concept.title,
        description: concept.description,
        status: Status.OPEN,
      },
    });

    const tasksChannel = await getTasksChannel();
    const conceptsChannel = await getConceptsChannel();

    await tasksChannel?.send({
      embeds: [await getTasksEmbed()],
    });
    await conceptsChannel?.send({
      embeds: [await getConceptsEmbed()],
    });

    await interaction.reply({
      embeds: [successEmbed('Concept has been opened as a new task!')],
    });
  } catch (error) {
    console.error(error);

    await interaction.reply({
      embeds: [defaultErrorEmbed],
    });
  }
};

export const data = new SlashCommandBuilder()
  .setName('open')
  .setDescription('Open a concept as a new task.')
  .addNumberOption((option) =>
    option.setName('id').setDescription('ID of the concept.').setRequired(true)
  );

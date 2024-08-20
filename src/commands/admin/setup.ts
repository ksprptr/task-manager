import prisma from '../../utils/prisma/prisma-client';
import { successEmbed } from '../../utils/functions/embed-functions';
import {
  sendTasksEmbed,
  sendConceptsEmbed,
} from '../../utils/functions/channel-functions';
import {
  Colors,
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

/**
 * Command representing setting up the bot
 */
export const execute = async (interaction: CommandInteraction) => {
  const tasksChannel = interaction.options.get('tasks_channel')?.channel;
  const conceptsChannel = interaction.options.get('concepts_channel')?.channel;
  const guildId = interaction.guildId ?? '';
  const guildData = await prisma.guild.findUnique({ where: { guildId } });

  if (guildData && !tasksChannel && !conceptsChannel) {
    const embed = new EmbedBuilder({
      title: `${guildData.name}`,
      description: 'This server has the following settings:',
    })
      .setColor(Colors.Blurple)
      .addFields(
        {
          name: 'Tasks Channel',
          value: guildData.tasksChannelId
            ? `<#${guildData.tasksChannelId}>`
            : 'Not set',
          inline: false,
        },
        {
          name: 'Concepts Channel',
          value: guildData.conceptsChannelId
            ? `<#${guildData.conceptsChannelId}>`
            : 'Not set',
          inline: false,
        }
      )
      .setThumbnail(guildData.icon)
      .setFooter({
        text: `Guild ID: ${guildData.guildId}`,
      })
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }

  if (tasksChannel) {
    await prisma.guild.update({
      where: { guildId },
      data: { tasksChannelId: tasksChannel.id },
    });

    await sendTasksEmbed();
  }

  if (conceptsChannel) {
    await prisma.guild.update({
      where: { guildId },
      data: { conceptsChannelId: conceptsChannel.id },
    });

    await sendConceptsEmbed();
  }

  return interaction.reply({
    embeds: [
      successEmbed(
        'Server settings updated!',
        'You have updated the server settings.'
      ),
    ],
    ephemeral: true,
  });
};

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Setup the bot.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption((option) =>
    option
      .setName('tasks_channel')
      .setDescription('Channel to send an active task list.')
      .setRequired(false)
  )
  .addChannelOption((option) =>
    option
      .setName('concepts_channel')
      .setDescription('Channel to send an active concept list.')
      .setRequired(false)
  );

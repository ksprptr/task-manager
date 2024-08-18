import prisma from '../../utils/prisma/prisma-client';
import { deployCommands } from '../../deploy-commands';
import { ActivityType, Client, Events } from 'discord.js';
import { Event as EventType, localGuild } from '../../utils/types/global-types';

/**
 * Event representing when a bot is ready
 */
const execute = async (client: Client) => {
  let guildId = '';

  client.guilds.cache.forEach((g) => {
    guildId = g.id;
  });

  const guild = await client.guilds.fetch(guildId);
  const guildExists = await prisma.guild.findUnique({
    where: {
      guildId,
    },
  });

  if (!guildExists) {
    console.log('Adding guild to to the database...');

    await prisma.guild.create({
      data: {
        guildId: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        tasksChannelId: '',
      },
    });

    console.log('Guild added to the database!');
  }

  localGuild.id = guild.id;

  client.user!.setActivity('/help', { type: ActivityType.Watching });

  deployCommands({ guildId: guildId });

  console.log('Discord bot is ready! 🤖');
};

export const data: EventType = {
  name: Events.ClientReady,
  execute,
};

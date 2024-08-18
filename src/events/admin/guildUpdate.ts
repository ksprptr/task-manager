import prisma from '../../utils/prisma/prisma-client';
import { Events, Guild } from 'discord.js';
import { Event as EventType } from '../../utils/types/global-types';

/**
 * Event representing guild update
 */
const execute = async (oldGuild: Guild, newGuild: Guild) => {
  if (oldGuild.icon !== newGuild.icon) {
    await prisma.guild.update({
      where: {
        guildId: newGuild.id,
      },
      data: {
        icon: newGuild.iconURL(),
      },
    });
  }

  if (oldGuild.name !== newGuild.name) {
    await prisma.guild.update({
      where: {
        guildId: newGuild.id,
      },
      data: {
        name: newGuild.name,
      },
    });
  }
};

export const data: EventType = {
  name: Events.GuildUpdate,
  execute,
};

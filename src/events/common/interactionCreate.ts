import { getData } from '../../utils/functions/global-functions';
import { errorEmbed } from '../../utils/functions/embed-functions';
import { Event as EventType } from '../../utils/types/global-types';
import { Events, Interaction } from 'discord.js';

/**
 * Event representing when a command is send
 */
const execute = async (interaction: Interaction) => {
  const commands = getData('commands');

  if (!interaction.isCommand()) return;

  const command = commands.find(
    (commandItem) => commandItem.data.name === interaction.commandName
  );

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    return interaction.reply({
      embeds: [
        errorEmbed('Error occurred!', 'See the console for more information.'),
      ],
      ephemeral: true,
    });
  }
};

export const data: EventType = {
  name: Events.InteractionCreate,
  execute,
};

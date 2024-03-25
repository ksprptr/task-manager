import { commands } from '../../commands';
import { EventType } from '../../utils/types/global-types';
import { Events, Interaction } from 'discord.js';

/**
 * Event representing when a command is send
 */
const execute = async (interaction: Interaction) => {
  // Check if the interaction is a command
  if (!interaction.isCommand()) return;

  // Get command name
  const { commandName } = interaction;

  // Execute command
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
};

// Export data of the event
export const data: EventType = {
  name: Events.InteractionCreate,
  execute,
};

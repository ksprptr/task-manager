import { config } from './config';
import { getData } from './utils/functions/global-functions';
import { REST, Routes } from 'discord.js';

// Create REST object
const rest = new REST({ version: '10' }).setToken(config.APP_TOKEN);

// Props interface
interface Props {
  guildId: string;
}

/**
 * Function representing the deployment of commands
 */
export const deployCommands = async ({ guildId }: Props) => {
  const commandsData = getData('commands').map((command) => command.data);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.APP_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

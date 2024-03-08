import { config } from './config';
import { commands } from './commands';
import { REST, Routes } from 'discord.js';
import { DeployCommandsProps } from './utils/types/global-types';

// Get all commands data
const commandsData = Object.values(commands).map((command) => command.data);

// Create REST object
const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

/**
 * Function representing the deployment of commands
 */
export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

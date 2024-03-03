import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { checkTaskChannel } from "./utils/functions/global-functions";
import { ActivityType, Client } from "discord.js";

// Create a new client
const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

/**
 * Event listener for when the bot is ready
 */
client.once("ready", (client) => {
  // Get guild id
  let guildId = "";
  client.guilds.cache.forEach((g) => {
    guildId = g.id;
  });

  // Set bot activity
  client.user.setActivity("/help", { type: ActivityType.Watching });

  // Check if task channel exists and is text channel
  checkTaskChannel(client);

  console.log("Discord bot is ready! 🤖");

  // Deploy commands
  deployCommands({ guildId: guildId });
}); 

/**
 * Event listener for when a command is used
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

// Login to Discord
client.login(config.DISCORD_TOKEN);
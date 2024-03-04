"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const commands_1 = require("./commands");
const deploy_commands_1 = require("./deploy-commands");
const global_functions_1 = require("./utils/functions/global-functions");
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.DirectMessages],
});
client.once(discord_js_1.Events.ClientReady, (client) => {
    let guildId = "";
    client.guilds.cache.forEach((g) => {
        guildId = g.id;
    });
    client.user.setActivity("/help", { type: discord_js_1.ActivityType.Watching });
    (0, global_functions_1.checkTaskChannel)(client);
    console.log("Discord bot is ready! 🤖");
    (0, deploy_commands_1.deployCommands)({ guildId: guildId });
});
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands_1.commands[commandName]) {
        commands_1.commands[commandName].execute(interaction);
    }
});
client.login(config_1.config.DISCORD_TOKEN);

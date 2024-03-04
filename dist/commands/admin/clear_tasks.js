"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const global_functions_1 = require("../../utils/functions/global-functions");
const data_1 = require("../../data/data");
const task_channel_functions_1 = require("../../utils/functions/task-channel-functions");
const embed_functions_1 = require("../../utils/functions/embed-functions");
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear all tasks.")
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    if (!(0, global_functions_1.isTaskChannel)(interaction.channelId)) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
    }
    if (!data_1.tasks.length) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("404 | Tasks not found", "There are no tasks to clear.")], ephemeral: true });
    }
    data_1.tasks.splice(0, data_1.tasks.length);
    interaction.reply({ embeds: [(0, embed_functions_1.successEmbed)("200 | Tasks cleared", "You successfully cleared all tasks.")], ephemeral: true });
    if (data_1.settings.lastMessageId) {
        (0, task_channel_functions_1.deleteLastMessage)(interaction.client, data_1.settings.lastMessageId);
    }
    const updatedTaskList = interaction.channel?.send({ embeds: [(0, embed_functions_1.taskListEmbed)(data_1.tasks)] });
    data_1.settings.lastMessageId = (await updatedTaskList)?.id || "";
    return;
}
exports.execute = execute;

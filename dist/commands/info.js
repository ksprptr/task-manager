"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const data_1 = require("../data/data");
const global_functions_1 = require("../utils/functions/global-functions");
const embed_functions_1 = require("../utils/functions/embed-functions");
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("info")
    .setDescription("Info about a task.")
    .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true));
async function execute(interaction) {
    if (!(0, global_functions_1.isTaskChannel)(interaction.channelId)) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
    }
    const id = interaction.options.get("id")?.value;
    const task = data_1.tasks.find((task) => task.id === id);
    if (!task) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
    }
    return interaction.reply({ embeds: [(0, embed_functions_1.taskInfoEmbed)(task)], ephemeral: true });
}
exports.execute = execute;

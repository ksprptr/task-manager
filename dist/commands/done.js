"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const global_types_1 = require("../utils/types/global-types");
const global_functions_1 = require("../utils/functions/global-functions");
const data_1 = require("../data/data");
const task_channel_functions_1 = require("../utils/functions/task-channel-functions");
const embed_functions_1 = require("../utils/functions/embed-functions");
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("done")
    .setDescription("Mark a task as done.")
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
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
    else if (task.status !== global_types_1.Status.IN_PROGRESS) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("409 | Task not in progress", "You can only mark tasks that are in progress as done.")], ephemeral: true });
    }
    task.status = global_types_1.Status.DONE;
    interaction.reply({ embeds: [(0, embed_functions_1.successEmbed)("200 | Task marked as done", `You successfully marked task **${task.title}** with id **${task.id}** as done.`)], ephemeral: true });
    if (data_1.settings.lastMessageId) {
        (0, task_channel_functions_1.deleteLastMessage)(interaction.client, data_1.settings.lastMessageId);
    }
    const updatedTaskList = interaction.channel?.send({ embeds: [(0, embed_functions_1.taskListEmbed)(data_1.tasks)] });
    data_1.settings.lastMessageId = (await updatedTaskList)?.id || "";
    return;
}
exports.execute = execute;

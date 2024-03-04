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
    .setName("assign")
    .setDescription("Assign a task to a user.")
    .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true))
    .addUserOption((option) => option.setName("user").setDescription("User to assign the task to.").setRequired(false));
async function execute(interaction) {
    if (!(0, global_functions_1.isTaskChannel)(interaction.channelId)) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
    }
    const id = interaction.options.get("id")?.value;
    const user = interaction.options.get("user")?.user ?? interaction.user;
    if (user !== interaction.user && !interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("403 | Forbidden", "You don't have permission to assign tasks to other users.")], ephemeral: true });
    }
    const task = data_1.tasks.find((task) => task.id === id);
    if (!task) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
    }
    else if (task?.status !== global_types_1.Status.OPEN) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("409 | Task not open", "You can only assign tasks that are open.")], ephemeral: true });
    }
    else if (task.assignedTo) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("409 | Task already assigned", `This task is already assigned to <@${task.assignedTo.id}>.`)], ephemeral: true });
    }
    task.assignedTo = user;
    task.status = global_types_1.Status.IN_PROGRESS;
    if (user === interaction.user) {
        interaction.reply({ embeds: [(0, embed_functions_1.successEmbed)("200 | Task assigned", `You successfully assigned task **${task.title}** with id **${task.id}** to you.`)], ephemeral: true });
    }
    else {
        interaction.reply({ embeds: [(0, embed_functions_1.successEmbed)("200 | Task assigned", `You successfully assigned task **${task.title}** with id **${task.id}** to <@${user?.id}>.`)], ephemeral: true });
        user.send({ embeds: [(0, embed_functions_1.successEmbed)("200 | Task assigned", `Task **${task.title}** with id **${task.id}** has been assigned to you. Check what task have been assigned to you!`)] });
    }
    if (data_1.settings.lastMessageId) {
        (0, task_channel_functions_1.deleteLastMessage)(interaction.client, data_1.settings.lastMessageId);
    }
    const updatedTaskList = interaction.channel?.send({ embeds: [(0, embed_functions_1.taskListEmbed)(data_1.tasks)] });
    data_1.settings.lastMessageId = (await updatedTaskList)?.id || "";
    return;
}
exports.execute = execute;

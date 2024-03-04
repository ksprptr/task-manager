"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const global_types_1 = require("../../utils/types/global-types");
const status_functions_1 = require("../../utils/functions/status-functions");
const global_functions_1 = require("../../utils/functions/global-functions");
const data_1 = require("../../data/data");
const task_channel_functions_1 = require("../../utils/functions/task-channel-functions");
const embed_functions_1 = require("../../utils/functions/embed-functions");
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit a task.")
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .addNumberOption((option) => option.setName("id").setDescription("ID of the task.").setRequired(true))
    .addStringOption((option) => option.setName("title").setDescription("Title of the task.").setRequired(false))
    .addStringOption((option) => option.setName("description").setDescription("Description of the task.").setRequired(false))
    .addStringOption((option) => option.setName("status").setDescription("Status of the task.").setRequired(false).addChoices({ name: 'Open', value: 'OPEN' }, { name: 'Concept', value: 'CONCEPT' }, { name: 'In progress', value: 'IN_PROGRESS' }, { name: 'Done', value: 'DONE' }))
    .addUserOption((option) => option.setName("assigned-to").setDescription("User to assign the task to. (select bot to assign to no one)").setRequired(false));
async function execute(interaction) {
    if (!(0, global_functions_1.isTaskChannel)(interaction.channelId)) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
    }
    const id = interaction.options.get("id")?.value;
    const title = interaction.options.get("title")?.value;
    const description = interaction.options.get("description")?.value;
    const status = interaction.options.get("status")?.value;
    let assignedTo = interaction.options.get("assigned-to")?.user;
    const task = data_1.tasks.find((task) => task.id === id);
    if (!task) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("404 | Task not found", "Task with this id doesn't exist.")], ephemeral: true });
    }
    else if (!title && !description && !status && !assignedTo) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("404 | Change not found", "You need to provide at least one field to update.")], ephemeral: true });
    }
    if (assignedTo && assignedTo === interaction.client.user) {
        assignedTo = "no-one";
    }
    try {
        const newTask = {
            ...task,
            title: title ? title : task.title,
            description: description ? description : task.description,
            status: status ? (0, status_functions_1.convertStatus)(status) : task.status,
            assignedTo: assignedTo === "no-one" ? null : assignedTo ? assignedTo : task.assignedTo,
        };
        if (task.assignedTo && assignedTo !== "no-one" && newTask.assignedTo !== task.assignedTo && newTask.assignedTo !== interaction.user) {
            return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("400 | Bad request", "You can't change task that already have been assigned.")], ephemeral: true });
        }
        else if (newTask.status === global_types_1.Status.OPEN && newTask.assignedTo) {
            return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("400 | Bad request", "You have to remove assigned user to edit task status to open.")], ephemeral: true });
        }
        else if ((newTask.status === global_types_1.Status.IN_PROGRESS || newTask.status === global_types_1.Status.DONE) && !newTask.assignedTo) {
            return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("400 | Bad request", "You can't change status to in progress or done without assigning the task.")], ephemeral: true });
        }
        data_1.tasks[data_1.tasks.indexOf(task)] = newTask;
        if (assignedTo && assignedTo !== "no-one" && newTask.assignedTo !== task.assignedTo && newTask.assignedTo !== interaction.user) {
            return assignedTo.send({ embeds: [(0, embed_functions_1.successEmbed)("200 | Task assigned", `Task **${task.title}** with id **${task.id}** has been assigned to you. Check what task have been assigned to you!`)] });
        }
        interaction.reply({ embeds: [(0, embed_functions_1.successEmbed)("200 | Task updated", "You successfully updated a task.")], ephemeral: true });
        if (data_1.settings.lastMessageId) {
            (0, task_channel_functions_1.deleteLastMessage)(interaction.client, data_1.settings.lastMessageId);
        }
        const updatedTaskList = interaction.channel?.send({ embeds: [(0, embed_functions_1.taskListEmbed)(data_1.tasks)] });
        data_1.settings.lastMessageId = (await updatedTaskList)?.id || "";
        return;
    }
    catch (error) {
        console.log(error);
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("500 | Internal bot error", "There was an error of updating the task. See console for more details.")], ephemeral: true });
    }
}
exports.execute = execute;

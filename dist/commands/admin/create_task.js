"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const status_functions_1 = require("../../utils/functions/status-functions");
const global_functions_1 = require("../../utils/functions/global-functions");
const data_1 = require("../../data/data");
const task_channel_functions_1 = require("../../utils/functions/task-channel-functions");
const embed_functions_1 = require("../../utils/functions/embed-functions");
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("create")
    .setDescription("Create a new task.")
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .addStringOption((option) => option.setName("status").setDescription("Status of the task.").setRequired(true).addChoices({ name: 'Open', value: 'OPEN' }, { name: 'Concept', value: 'CONCEPT' }))
    .addStringOption((option) => option.setName("title").setDescription("Title of the task.").setRequired(true))
    .addStringOption((option) => option.setName("description").setDescription("Description of the task.").setRequired(true))
    .addStringOption((option) => option.setName("concept").setDescription("Concept message of the task.").setRequired(false));
async function execute(interaction) {
    if (!(0, global_functions_1.isTaskChannel)(interaction.channelId)) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("403 | Forbidden", "You can only use this command in the task channel.")], ephemeral: true });
    }
    const id = data_1.tasks.length + 1;
    const title = interaction.options.get("title")?.value;
    const statusValue = interaction.options.get("status")?.value;
    const description = interaction.options.get("description")?.value;
    const conceptMessage = interaction.options.get("concept")?.value;
    const isConcept = statusValue === "CONCEPT";
    if (statusValue === "CONCEPT" && !conceptMessage) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("404 | Concept not found", "You must provide a concept for a concept task.")], ephemeral: true });
    }
    else if (data_1.tasks.find((task) => task.title.toLowerCase() === title.toLowerCase())) {
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("409 | Task already exist", "A task with this title already exists.")], ephemeral: true });
    }
    const status = (0, status_functions_1.convertStatus)(statusValue);
    try {
        const newTask = {
            id: id,
            title: title,
            description: description,
            status: status,
            concept: isConcept ? conceptMessage : undefined,
            assignedTo: null,
        };
        data_1.tasks.push(newTask);
        interaction.reply({ embeds: [(0, embed_functions_1.successEmbed)("201 | Task created", "You successfully created a task.")], ephemeral: true });
        if (data_1.settings.lastMessageId) {
            (0, task_channel_functions_1.deleteLastMessage)(interaction.client, data_1.settings.lastMessageId);
        }
        const updatedTaskList = interaction.channel?.send({ embeds: [(0, embed_functions_1.taskListEmbed)(data_1.tasks)] });
        data_1.settings.lastMessageId = (await updatedTaskList)?.id || "";
        return;
    }
    catch (error) {
        console.log(error);
        return interaction.reply({ embeds: [(0, embed_functions_1.errorEmbed)("500 | Internal bot error", "There was an error of creating the task. See console for more details.")], ephemeral: true });
    }
}
exports.execute = execute;

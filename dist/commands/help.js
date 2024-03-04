"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("help")
    .setDescription("Help about the bot.");
async function execute(interaciton) {
    const embed = new discord_js_1.EmbedBuilder({
        title: "Help",
        description: "This bot is used to manage tasks. You can create, assign, and mark tasks as done.",
    })
        .addFields({
        name: "Commands",
        value: "You can use the following commands:\n\n`/info` - Get more info about a task\n`/assign` - Assign a task\n`/done` - Mark a task as done\n`/help` - Get help about the bot",
    })
        .addFields({
        name: "Tasks",
        value: "Task format in the task list:\n\n**[id]** | [status] | **Title of the task** *(concept message)*\n└~~-~~ Assigned to: [user]",
    })
        .setColor("Blue");
    if (interaciton.memberPermissions?.has(discord_js_1.PermissionFlagsBits.Administrator)) {
        embed.addFields({
            name: "Admin Commands",
            value: "You can use the following commands:\n\n`/create` - Create a task\n`/edit` - Edit a task\n`/remove` - Remove a task\n`/clear` - Clear all tasks",
        });
    }
    return interaciton.reply({ embeds: [embed], ephemeral: true });
}
exports.execute = execute;

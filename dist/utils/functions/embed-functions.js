"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskListEmbed = exports.taskInfoEmbed = exports.errorEmbed = exports.successEmbed = void 0;
const global_types_1 = require("../types/global-types");
const status_functions_1 = require("./status-functions");
const discord_js_1 = require("discord.js");
const successEmbed = (title, message) => {
    const embed = new discord_js_1.EmbedBuilder({
        title: title,
        description: message,
    }).setColor("Green");
    return embed;
};
exports.successEmbed = successEmbed;
const errorEmbed = (title, message) => {
    const embed = new discord_js_1.EmbedBuilder({
        title: title,
        description: message,
    }).setColor("Red");
    return embed;
};
exports.errorEmbed = errorEmbed;
const taskInfoEmbed = (task) => {
    const getColor = (status) => {
        switch (status) {
            case global_types_1.Status.OPEN:
                return "Red";
            case global_types_1.Status.IN_PROGRESS:
                return "Yellow";
            case global_types_1.Status.DONE:
                return "Green";
            case global_types_1.Status.CONCEPT:
                return "Purple";
            default:
                return "Grey";
        }
    };
    const embed = new discord_js_1.EmbedBuilder({
        title: task.title,
        description: `${task.description}\n\n**ID:** ${task.id}\n**Status: ** ${(0, status_functions_1.formatStatus)(task.status)}\n**Assigned To:** ${task.assignedTo ? `<@${task.assignedTo.id}>` : "No one"}`,
    }).setColor(getColor(task.status));
    return embed;
};
exports.taskInfoEmbed = taskInfoEmbed;
const taskListEmbed = (tasks) => {
    let description = "";
    if (tasks.length === 0) {
        description += "\nNo tasks found.";
    }
    tasks.forEach((task) => {
        description += `\n\n**[${task.id}]** | ${(0, status_functions_1.formatStatus)(task.status)} | **${task.title}**${task.concept ? ` *(${task.concept})*` : ""}\n└~~-~~ Assigned to: ${task.assignedTo ? `<@${task.assignedTo.id}>` : "No one"}`;
    });
    const embed = new discord_js_1.EmbedBuilder({
        title: "Task List",
        description: description,
    }).setColor("Blue");
    return embed;
};
exports.taskListEmbed = taskListEmbed;

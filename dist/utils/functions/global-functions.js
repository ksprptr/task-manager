"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTaskChannel = exports.checkTaskChannel = void 0;
const data_1 = require("../../data/data");
const discord_js_1 = require("discord.js");
const checkTaskChannel = (client) => {
    const channel = client.channels.cache.get(data_1.settings.taskChannelId);
    if (!channel) {
        throw new Error("Task channel not found. Check settings in /src/data/data.ts (taskChannelId). Keep in mind task channel must be text channel.");
    }
    else if (channel && channel.type !== discord_js_1.ChannelType.GuildText) {
        throw new Error("Task channel must be text channel. Check settings in /src/data/data.ts (taskChannelId).");
    }
};
exports.checkTaskChannel = checkTaskChannel;
const isTaskChannel = (channelId) => {
    return channelId === data_1.settings.taskChannelId;
};
exports.isTaskChannel = isTaskChannel;

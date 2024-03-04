"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLastMessage = void 0;
const data_1 = require("../../data/data");
const discord_js_1 = require("discord.js");
const deleteLastMessage = async (client, messageId) => {
    const channel = getTaskChannel(client);
    if (!channel)
        return;
    if (channel.type !== discord_js_1.ChannelType.GuildText)
        return;
    const message = await channel.messages.fetch(messageId);
    message.delete();
};
exports.deleteLastMessage = deleteLastMessage;
const getTaskChannel = (client) => {
    const taskChannel = client.channels.cache.get(data_1.settings.taskChannelId);
    return taskChannel;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStatus = exports.formatStatus = void 0;
const global_types_1 = require("../types/global-types");
const formatStatus = (status) => {
    return getStatusEmoji(status) + " " + status;
};
exports.formatStatus = formatStatus;
const convertStatus = (status) => {
    switch (status) {
        case "OPEN":
            return global_types_1.Status.OPEN;
        case "IN_PROGRESS":
            return global_types_1.Status.IN_PROGRESS;
        case "DONE":
            return global_types_1.Status.DONE;
        case "CONCEPT":
            return global_types_1.Status.CONCEPT;
    }
};
exports.convertStatus = convertStatus;
const getStatusEmoji = (status) => {
    switch (status) {
        case global_types_1.Status.OPEN:
            return "📋";
        case global_types_1.Status.IN_PROGRESS:
            return "🔨";
        case global_types_1.Status.DONE:
            return "✅";
        case global_types_1.Status.CONCEPT:
            return "🧠";
    }
};

import * as done from "./done";
import * as edit from "./admin/edit_task";
import * as info from "./info";
import * as help from "./help";
import * as clear from "./admin/clear_tasks";
import * as assign from "./assign";
import * as create from "./admin/create_task";
import * as remove from "./admin/remove_task";

/**
 * Export all commands
 */
export const commands = {
  done,
  edit,
  info,
  help,
  clear,
  assign,
  create,
  remove,
};
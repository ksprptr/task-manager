import { User } from "discord.js";

export interface DeployCommandsProps {
  guildId: string;
};

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  concept?: string;
  assignedTo: User | null;
}

export interface Settings {
  taskChannelId: string;
  lastMessageId: string;

}
export enum Status {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  CONCEPT = "Concept",
}

import { User } from 'discord.js';

export interface DeployCommandsProps {
  guildId: string;
}

export interface EventType {
  name: string;
  execute: (...args: any[]) => void;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  concept?: string;
  assignedTo: User | null;
}

export enum Status {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  CONCEPT = 'Concept',
}

export interface Settings {
  taskChannelId: string;
  lastMessageId: string;
}

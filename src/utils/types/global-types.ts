export const localGuild = {
  id: '',
  name: '',
};

export interface Event {
  name: string;
  execute: (...args: any[]) => void;
}

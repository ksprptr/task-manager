import { errorEmbed } from '../functions/embed-functions';

export const tasksChannelMissingEmbed = errorEmbed(
  'Error occurred!',
  'Please set the tasks channel first using **/setup** command.'
);

export const conceptsChannelMissingEmbed = errorEmbed(
  'Error occurred!',
  'Please set the concepts channel first using **/setup** command.'
);

export const defaultErrorEmbed = errorEmbed(
  'Error occurred!',
  'See the console for more information.'
);

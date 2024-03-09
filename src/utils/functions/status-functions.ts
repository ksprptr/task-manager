import { Status } from '../types/global-types';

/**
 * Function representing conversion of status
 */
export const convertStatus = (status: string) => {
  switch (status) {
    case 'OPEN':
      return Status.OPEN;
    case 'IN_PROGRESS':
      return Status.IN_PROGRESS;
    case 'DONE':
      return Status.DONE;
    case 'CONCEPT':
      return Status.CONCEPT;
  }
};

/**
 * Function representing getting the status emoji
 */
const getStatusEmoji = (status: Status) => {
  switch (status) {
    case Status.OPEN:
      return '📋';
    case Status.IN_PROGRESS:
      return '🔨';
    case Status.DONE:
      return '✅';
    case Status.CONCEPT:
      return '🧠';
  }
};

/**
 * Function representing formatting of the status
 */
export const formatStatus = (status: Status) => {
  return getStatusEmoji(status) + ' ' + status;
};

import { Status } from '@prisma/client';

/**
 * Function to get status as string
 */
export const getStatus = (status: Status) => {
  switch (status) {
    case Status.OPEN:
      return '📋 Open';
    case Status.IN_PROGRESS:
      return '🔨 In Progress';
    case Status.DONE:
      return '✅ Done';
  }
};

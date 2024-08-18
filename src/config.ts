import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables
const { APP_TOKEN, APP_CLIENT_ID } = process.env;

// Validation
if (!APP_TOKEN || !APP_CLIENT_ID) {
  throw new Error('Missing environment variables.');
}

// Export config
export const config = {
  APP_TOKEN,
  APP_CLIENT_ID,
};

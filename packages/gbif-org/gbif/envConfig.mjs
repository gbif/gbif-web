import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export const secretEnv = Object.freeze({ ...process.env });
export const publicEnv = Object.freeze(
  Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith('PUBLIC_')))
);

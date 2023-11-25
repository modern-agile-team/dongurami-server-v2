const RDB = {
  RDB_HOST: 'RDB_HOST',
  RDB_PORT: 'RDB_PORT',
  RDB_USER_NAME: 'RDB_USER_NAME',
  RDB_PASSWORD: 'RDB_PASSWORD',
  RDB_DATABASE: 'RDB_DATABASE',
} as const;

const JWT = {
  JWT_SECRET: 'JWT_SECRET',
} as const;

export const ENV_KEY = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  ...RDB,
  ...JWT,
} as const;

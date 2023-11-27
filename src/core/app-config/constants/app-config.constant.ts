const RDB = {
  RDB_HOST: 'RDB_HOST',
  RDB_PORT: 'RDB_PORT',
  RDB_USER_NAME: 'RDB_USER_NAME',
  RDB_PASSWORD: 'RDB_PASSWORD',
  RDB_DATABASE: 'RDB_DATABASE',
} as const;

export const ENV_KEY = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  ...RDB,
} as const;

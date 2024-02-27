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

const AWS = {
  AWS_S3_ACCESS_KEY: 'AWS_S3_ACCESS_KEY',
  AWS_S3_SECRET_KEY: 'AWS_S3_SECRET_KEY',
} as const;

export const ENV_KEY = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  DOMAIN: 'DOMAIN',
  ...RDB,
  ...JWT,
  ...AWS,
} as const;

import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
  STATIC_FOLDER: string;
  JWT_SECRET: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Connections port',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Password salt',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Database host IP',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Username to connect to the database (MongoDB)',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Database connection password (MongoDB)',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: 27017,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: 'igor-six-cities'
  },
  STATIC_FOLDER: {
    doc: 'Folder for uploaded images and other static files',
    format: String,
    env: 'STATIC_FOLDER',
    default: 'static'
  },
  JWT_SECRET: {
    doc: 'Secret text for signing JWT tokens',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  }
});

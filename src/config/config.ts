import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  DB_CONNECTION_URI: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: number;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  MAX_JSON_SIZE: string;
  MAX_FILE_SIZE: number;
  URL_ENCODED: boolean;
  REQUEST_LIMIT_TIME: number;
  REQUEST_LIMIT_NUMBER: number;
  WEB_CACHE: boolean;
  EXPRESS_FILE_UPLOAD_CONFIG: object;
}

const config: Config = {
  PORT: parseInt(process.env.PORT as string, 10),
  DB_CONNECTION_URI: process.env.DB_CONNECTION_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRATION_TIME: parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT as string, 10),
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  MAX_JSON_SIZE: process.env.MAX_JSON_SIZE as string,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE as string, 10),
  URL_ENCODED: process.env.URL_ENCODED === 'true',
  REQUEST_LIMIT_TIME: parseInt(process.env.REQUEST_LIMIT_TIME as string, 10),
  REQUEST_LIMIT_NUMBER: parseInt(process.env.REQUEST_LIMIT_NUMBER as string, 10),
  WEB_CACHE: process.env.WEB_CACHE === 'true',
  EXPRESS_FILE_UPLOAD_CONFIG: {
    createParentPath: true,
    preserveExtension: true,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE as string, 10),
    },
  },
};

export default config;

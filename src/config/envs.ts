import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  ADMIN0_NAME: string;
  ADMIN0_PASSWORD: string;
  ADMIN0_EMAIL: string;
  ADMIN0_PHONE: string;
  JWT_SECRET: string;
  STRIPE_SECRET: string;
  GOOGLE_CLOUD_PROJECT_ID: string;
  GOOGLE_CLOUD_CLIENT_EMAIL: string;
  GOOGLE_CLOUD_PRIVATE_KEY: string;
  GMAIL_EMAIL_USER: string;
  GEMAIL_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET: string;
  GOOGLE_CALLBACK: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    ADMIN0_NAME: joi.string().required(),
    ADMIN0_PASSWORD: joi.string().required(),
    ADMIN0_EMAIL: joi.string().required(),
    ADMIN0_PHONE: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    STRIPE_SECRET: joi.string().required(),
    GOOGLE_CLOUD_PROJECT_ID: joi.string().required(),
    GOOGLE_CLOUD_CLIENT_EMAIL: joi.string().required(),
    GOOGLE_CLOUD_PRIVATE_KEY: joi.string().required(),
    GMAIL_EMAIL_USER: joi.string().required(),
    GEMAIL_PASSWORD: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_SECRET: joi.string().required(),
    GOOGLE_CALLBACK: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  Admin0Name: envVars.ADMIN0_NAME,
  Admin0Password: envVars.ADMIN0_PASSWORD,
  Admin0Email: envVars.ADMIN0_EMAIL,
  Admin0phone: envVars.ADMIN0_PHONE,
  jwtSecret: envVars.JWT_SECRET,
  stripeSecret: envVars.STRIPE_SECRET,
  googleCloudProjectId: envVars.GOOGLE_CLOUD_PROJECT_ID,
  googleCloudClientEmail: envVars.GOOGLE_CLOUD_CLIENT_EMAIL,
  googleCloudPrivateKey: envVars.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  gmailEmail: envVars.GMAIL_EMAIL_USER,
  gmailPassword: envVars.GEMAIL_PASSWORD,
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_SECRET,
  googleClientCallBack: envVars.GOOGLE_CALLBACK,
};

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  ADMIN0_NAME: string;
  ADMIN0_PASSWORD: string;
  ADMIN0_EMAIL: string;
  ADMIN0_PHONE: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    ADMIN0_NAME: joi.string().required(),
    ADMIN0_PASSWORD: joi.string().required(),
    ADMIN0_EMAIL: joi.string().required(),
    ADMIN0_PHONE: joi.string().required(),
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
};

import Joi from 'joi'

export const envSchema = Joi.object({
  // Основные настройки
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().port(),
  PORT_GATEWAY: Joi.number().port(),

  CORS_ORIGIN: Joi.string().default('*'),

  // Postgres
  POSTGRES_DB_NAME: Joi.string(),
  POSTGRES_HOST: Joi.string(),
  POSTGRES_USER: Joi.string(),
  POSTGRES_PASS: Joi.string(),
  POSTGRES_PORT: Joi.string(),
}).required()

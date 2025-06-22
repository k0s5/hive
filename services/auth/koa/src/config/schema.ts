import Joi from 'joi'

export const envSchema = Joi.object({
  // Основные настройки
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // PORT: Joi.number().port().default(3000),
  PORT: Joi.number().port(),
  PORT_GATEWAY: Joi.number().port(),

  CORS_ORIGIN: Joi.string().default('*'),
  // Email
  // SMTP_HOST: Joi.string().when('NODE_ENV', {
  //   is: 'production',
  //   then: Joi.required(),
  //   otherwise: Joi.optional(),
  // }),
  // SMTP_PORT: Joi.number().port().default(587),
  // SMTP_USER: Joi.string().email().optional(),
  // SMTP_PASSWORD: Joi.string().optional(),

  // Другие настройки
  // LOG_LEVEL: Joi.string()
  //   .valid('error', 'warn', 'info', 'debug')
  //   .default('info'),
})
  // .unknown() // разрешить дополнительные переменные
  .required()

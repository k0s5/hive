import * as Joi from 'joi'

export const configValidationSchema = Joi.object({
  // Server configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  // CORS configuration
  CORS_ORIGIN: Joi.string().default('*'),

  // JWT configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Redis configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().min(0).max(15).default(0),

  // Microservices URLs
  AUTH_SERVICE_URL: Joi.string().uri().required(),
  USER_SERVICE_URL: Joi.string().uri().required(),
  CHAT_SERVICE_URL: Joi.string().uri().required(),
  NOTIFICATION_SERVICE_URL: Joi.string().uri().required(),

  // Rate limiting
  THROTTLE_TTL: Joi.number().positive().default(60),
  THROTTLE_LIMIT: Joi.number().positive().default(100),

  // File upload
  MAX_FILE_SIZE: Joi.number().positive().default(10485760), // 10MB
  UPLOAD_DEST: Joi.string().default('./uploads'),
})

import dotenv from 'dotenv'
import { envSchema } from './schema'

interface Config {
  nodeEnv: 'development' | 'production' | 'test'
  ports: {
    service: number
    gateway: number
  }

  saltRounds: number

  postgres: { uri: string }

  cors?: {
    origin: string
  }
}

// Load environment variables from a specific .env file
dotenv.config({
  path: require.resolve('../../../../../config/environment/postgres/.env'),
})

function validateEnv(): Config {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false, // show all errors
    stripUnknown: true, // remove unknown fields
  })

  if (error) {
    const errorMessage = error.details
      .map((detail) => `${detail.path.join('.')}: ${detail.message}`)
      .join('\n')

    throw new Error(`Config validation error:\n${errorMessage}`)
  }

  console.log('============ CONFIG:', value)

  // Transform a flat structure into a nested one
  return {
    nodeEnv: value.NODE_ENV,
    ports: {
      service: value.PORT,
      gateway: value.PORT_GATEWAY,
    },

    saltRounds: value.SALT_ROUNDS,

    cors: {
      origin: value.CORS_ORIGIN,
    },

    postgres: {
      uri: `postgresql://${value.POSTGRES_USER}:${value.POSTGRES_PASS}@${value.POSTGRES_HOST}:${value.POSTGRES_PORT}/${value.POSTGRES_DB_NAME}`,
    },
  }
}

// Exporting the validated configuration
export const config: Config = validateEnv()

// Additional utilities
export const isDevelopment = () => config.nodeEnv === 'development'
export const isProduction = () => config.nodeEnv === 'production'
export const isTest = () => config.nodeEnv === 'test'

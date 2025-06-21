import dotenv from 'dotenv'

// Load environment variables
dotenv.config({
  path: require.resolve('../../../../config/environment/postgres/.env'),
})

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  saltRounds: process.env.SALT_ROUNDS
    ? parseInt(process.env.SALT_ROUNDS) || undefined // if NaN then undefined
    : undefined,

  postgres: {
    uri:
      process.env.POSTGRES_URI ||
      `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`,
  },
}

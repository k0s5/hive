import dotenv from 'dotenv'

// Load environment variables
dotenv.config({
  path: require.resolve('../../../../config/environment/postgres/.env'),
})

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  saltRounds: process.env.SALT_ROUNDS,

  mongodb: {
    uri:
      process.env.MONGO_URI ||
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:27017/${process.env.MONGO_DB_NAME}`,
  },
  postgres: {
    uri:
      process.env.POSTGRES_URI ||
      `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`,
  },
}

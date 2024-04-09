export default () => ({
  PORT: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS: process.env.REDIS,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
  POSTGRES_HOST_AUTH_METHOD: process.env.POSTGRES_HOST_AUTH_METHOD,
});

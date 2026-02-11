require('dotenv').config();

const commonLocal = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
};

module.exports = {
  development: commonLocal,
  test: {
    ...commonLocal,
    database: (process.env.DB_NAME || 'news_api') + '_test',
  },
  // Produção (Neon/Render): usa DATABASE_URL com SSL
  production: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : commonLocal,
};

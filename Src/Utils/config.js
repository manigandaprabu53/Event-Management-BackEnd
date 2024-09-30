import 'dotenv/config';

export default {
    DB_NAME: process.env.DB_NAME,
    DB_URL: process.env.DB_URL,
    SALT: Number(process.env.SALT),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    SEC_KEY: process.env.SEC_KEY
}
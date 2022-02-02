const dotenv = require('dotenv');
const config = {};
dotenv.config({path: './server/.env'});

config.DB_NAME="memento";
config.DB_DIALECT="mysql";
config.DB_POOL= {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
};
config.DB_HOST=process.env.DB_HOST;
config.DB_USER=process.env.DB_USER;
config.DB_PASSWORD=process.env.DB_PASSWORD;
config.JWT_SECRET=process.env.JWT_SECRET;
config.SMTP_USER=process.env.SMTP_USER;
config.SMTP_SECRET=process.env.SMTP_SECRET;
config.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
config.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

module.exports = config;
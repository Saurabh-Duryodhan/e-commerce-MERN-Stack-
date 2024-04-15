import dotenv from "dotenv";
dotenv.config();
console.log(process.env.NODE_ENV);
const conf = {
  APP_PORT: process.env.APP_PORT,
  DB_PASS: process.env.DB_PASS,
  NODE_ENV: process.env.NODE_ENV,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
const config = Object.freeze(conf);
export const getConfig = (envVariable) => config[envVariable];

import { Sequelize } from "sequelize";

const HOST = process.env.DATABASE_HOST;
const USER = process.env.DATABASE_USER;
const PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE = process.env.DATABASE;

const sequelize = new Sequelize({
  dialect: "mysql",
  host: HOST,
  username: USER,
  password: PASSWORD,
  database: DATABASE,
});

export default sequelize;

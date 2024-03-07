import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import companyRoutes from './routes/companyRoutes';
import employeeRoutes from "./routes/employeeRoutes";
import fileRoutes from './routes/fileRoutes';
import sequelize from "./config/db";
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // to parse url-encoded bodies
app.use(express.json());
app.use(cookieParser());

// API Endpoints

app.use('/company', companyRoutes);
app.use('/company/employee', employeeRoutes);
app.use('/company/file', fileRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});

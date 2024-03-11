import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import companyRoutes from "./routes/companyRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import CompanyFileRoutes from "./routes/companyFileRoutes";
import EmployeeFileRoutes from "./routes/employeeFileRoutes";
import sequelize from "./config/db";
import cookieParser from "cookie-parser";
import { SwaggerOptions } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import swOptions from "./config/swOptions";

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // to parse url-encoded bodies
app.use(express.json());
app.use(cookieParser());

// API Endpoints

app.use("/company", companyRoutes);
app.use("/company/file", CompanyFileRoutes);
app.use("/company/employee", employeeRoutes);
app.use("/company/employee/file", EmployeeFileRoutes);

sequelize.sync({ force: false }).then(() => {
  const sql = `
    INSERT INTO subscriptions (id, plan_name, max_files_per_month, max_users, price_per_user, fixed_price, additional_file_cost, company_id, expiration_date, createdAt, updatedAt)
    VALUES
    (1, 'free', 10, 1, 0, 0, 0, NULL, '9999-01-01 00:00:00', NOW(), NOW()),
    (2, 'basic', 100, 10, 5, 0, 0, NULL, '9999-01-01 00:00:00', NOW(), NOW()),
    (3, 'premium', 1000, 999999999, 0, 300, 0.50, NULL, '9999-01-01 00:00:00', NOW(), NOW());
  `;

  sequelize
    .query(sql)
    .then(() => {
      console.log("Data inserted successfully");
    })
    .catch((err) => {
      console.error("Error inserting data: ", err);
    });

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
});

const swaggerOptions: SwaggerOptions = swOptions;

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/not-all-api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

export default app;

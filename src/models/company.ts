import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import { TCompany, TEmployee, TFile, TSubscription } from "../types/types";

const Company = sequelize.define<TCompany>("Company", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
  },
  industry: {
    type: DataTypes.STRING,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  email_verify_token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Employee = sequelize.define<TEmployee>("Employees", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  email_verify_token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Subscription = sequelize.define<TSubscription>("Subscription", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  plan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  max_files_per_month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_users: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_per_user: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fixed_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  additional_file_cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Files = sequelize.define<TFile>("Files", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_type: {
    type: DataTypes.ENUM("CSV", "XLS", "XLSX"),
  },
  shared_with_all: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

const FileEmployeeMapping = sequelize.define("filejunction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  file_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Files,
      key: "id",
    },
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: "id",
    },
  },
});

Employee.belongsTo(Company, { foreignKey: "company_id" });
Company.hasMany(Employee, { foreignKey: "company_id" });

Subscription.belongsTo(Company, { foreignKey: "company_id" });
Company.hasOne(Subscription, { foreignKey: "company_id" });

Company.hasMany(Files, { foreignKey: "company_id" });
Employee.hasMany(Files, { foreignKey: "employee_id" });


Files.belongsToMany(Employee, { through: FileEmployeeMapping, foreignKey: "file_id" });
Employee.belongsToMany(Files, { through: FileEmployeeMapping, foreignKey: "employee_id" });

// Files.belongsToMany(Employee, { through: "id" });
// Files.belongsToMany(Company, { through: "company_id" });

export { Company, Employee, Subscription, Files, FileEmployeeMapping };

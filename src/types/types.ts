import { Model } from "sequelize";

export type TCompany =  Model & {
  id: number;
  company_name: string;
  email: string;
  password: string;
  country: string;
  industry: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  email_verify_token: string;
};

export type TEmployee = Model & {
  id: number;
  company_id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  email_verify_token: string;
}

export type TToken = Model & {
  id: number;
  token: string;
  company_id: number;
  employee_id: number;
  expiresAt: Date;
}
import { Request } from "express";
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

export type TSubscription = Model & {
  id: number;
  company_id: number;
  plan_name: string;
  max_files_per_month: number;
  max_users: number;
  price_per_user: number;
  fixed_price: number;
  additional_file_cost: number;
  createdAt: Date;
  updatedAt: Date;
  expiration_date: Date;
}

export type TFile = Model & {
  id: number;
  company_id: number;
  file_name: string;
  file_type: string;
  shared_with_all: boolean;
  employee_id: number;
  addEmployees: any;
  createdAt: Date;
  updatedAt: Date;
}

export type TFileEmployeeMapping = Model & {
  id: number;
  file_id: number;
  employee_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TCustomRequestC = Request & { companyId?: number; } & Request;

export type TCustomRequestE = Request & { employeeId?: number; companyId?: number };
import { Response } from "express";
import jwt from "jsonwebtoken";

const secret: any = process.env.JWT_SECRET;

const generateCompanyToken = (res: Response, companyId: number) => {
  const token = jwt.sign({ companyId }, secret, {
    expiresIn: "30s", // Set the expiration time for the token (1 day)
  });

  res.cookie("jwt_owner", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 1000, // 30 seconds
  });
};

const generateEmployeeToken = (res: Response, employeeId: number) => {
  const token = jwt.sign({ employeeId }, secret, {
    expiresIn: "30s", // Set the expiration time for the token (1 day)
  })

  res.cookie("jwt_employee", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 1000, // 30 seconds
  })
}

export { generateCompanyToken, generateEmployeeToken };

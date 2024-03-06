import { Response } from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshtoken";
import { Op } from "sequelize";

const secret: any = process.env.JWT_SECRET;
const refreshSecret: any = process.env.JWT_REFRESH_SECRET;

const generateCompanyToken = (res: Response, companyId: number) => {
  const token = jwt.sign({ companyId }, secret, {
    expiresIn: "1d", // Set the expiration time for the token (1 day)
  });

  res.cookie("jwt_owner", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
};

const generateEmployeeToken = async (res: Response, employeeId: number) => {
  const employee_accessToken = jwt.sign({ employeeId }, secret, {
    expiresIn: "15m",
  });

  const employee_refreshToken = jwt.sign({ employeeId }, refreshSecret, {
    expiresIn: "1d",
  });

  const refreshToken = await RefreshToken.findOne({
    where: { employee_id: employeeId, expiresAt: { [Op.gte]: new Date() } },
  });

  // console.log(
  //   "DB-----RFT",
  //   refreshToken?.dataValues.token === employee_refreshToken
  // );

  if (!refreshToken) {
    await RefreshToken.create({
      employee_id: employeeId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      token: employee_refreshToken,
    });
  }

  if (refreshToken?.dataValues.token !== employee_refreshToken) {
    await RefreshToken.update(
      {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        token: employee_refreshToken,
      },
      {
        where: { employee_id: employeeId },
      }
    );
  }


  return { employee_accessToken, employee_refreshToken };
};

export { generateCompanyToken, generateEmployeeToken };

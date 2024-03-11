import { Response } from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshtoken";
import { Op } from "sequelize";

const secret: any = process.env.JWT_SECRET;
const refreshSecret: any = process.env.JWT_REFRESH_SECRET;

const generateCompanyToken = async (res: Response, companyId: number) => {
  const owner_accessToken = jwt.sign({ companyId }, secret, {
    expiresIn: "25m",
  });

  const owner_refreshToken = jwt.sign({ companyId }, refreshSecret, {
    expiresIn: "1d",
  });

  const refreshToken = await RefreshToken.findOne({
    where: { company_id: companyId, expiresAt: { [Op.gte]: new Date() } },
  });

  if (!refreshToken) {
    await RefreshToken.create({
      company_id: companyId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      token: owner_refreshToken,
    });
  }

  if (refreshToken?.dataValues.token !== owner_refreshToken) {
    await RefreshToken.update(
      { token: owner_refreshToken },
      { where: { company_id: companyId } }
    );
  }

  return {
    owner_accessToken,
    owner_refreshToken,
  };
};

const generateEmployeeToken = async (employeeId: number, companyId: number) => {
  const employee_accessToken = jwt.sign({ employeeId, companyId }, secret, {
    expiresIn: "25m",
  });

  const employee_refreshToken = jwt.sign(
    { employeeId, companyId },
    refreshSecret,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = await RefreshToken.findOne({
    where: {
      employee_id: employeeId,
      company_id: companyId,
      expiresAt: { [Op.gte]: new Date() },
    },
  });

  // console.log(
  //   "DB-----RFT",
  //   refreshToken?.dataValues.token === employee_refreshToken
  // );

  if (!refreshToken) {
    await RefreshToken.create({
      employee_id: employeeId,
      company_id: companyId,
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

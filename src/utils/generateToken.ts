import { Response } from "express";
import jwt from "jsonwebtoken";

const secret: any = process.env.JWT_SECRET;

const generateToken = (res: Response, companyId: number) => {
  const token = jwt.sign({ companyId }, secret, {
    expiresIn: "1d", // Set the expiration time for the token (1 day)
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
};

export default generateToken;

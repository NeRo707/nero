import { NextFunction, Request, Response } from "express";
import RefreshToken from "../models/refreshtoken";
import { Op } from "sequelize";
import { generateCompanyToken } from "../utils/generateToken";

const refreshOwnerToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.owner_refreshToken;
  console.log(req.cookies);

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Refresh token not provided" });
  }

  try {
    // Verify the refresh token against the database
    const storedRefreshToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        expiresAt: { [Op.gte]: new Date() },
      },
    });
    console.log("---DATABASETOKEN---",storedRefreshToken?.dataValues);
    if (!storedRefreshToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid refresh token" });
    }

    const { company_id } = storedRefreshToken;

    // Generate a new access token and refresh token
    const { owner_accessToken, owner_refreshToken } =
      await generateCompanyToken(res, company_id);
    // Update the refresh token in the database
    await RefreshToken.update(
      {
        token: owner_refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { where: { token: refreshToken } }
    );

    // Set the new refresh token as an HTTP-only cookie
    res.cookie("owner_refreshToken", owner_refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({ owner_accessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid refresh token" });
  }
};

export default refreshOwnerToken;

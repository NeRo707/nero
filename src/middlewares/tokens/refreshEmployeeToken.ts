import { NextFunction, Request, Response } from "express";
import RefreshToken from "../../models/refreshtoken";
import { Op } from "sequelize";
import { generateEmployeeToken } from "../../utils/generateToken";

/**
 * Verify refresh token and generate new access token for employee.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next middleware function
 * @returns {Promise<Response | void>} a Promise that resolves to void
 */
const refreshEmployeeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const refreshToken = req.cookies.employee_refreshToken;
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

    const { employee_id } = storedRefreshToken;

    // Generate a new access token and refresh token
    const { employee_accessToken, employee_refreshToken } =
      await generateEmployeeToken(res, employee_id);
    // Update the refresh token in the database
    await RefreshToken.update(
      {
        token: employee_refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { where: { token: refreshToken } }
    );

    // Set the new refresh token as an HTTP-only cookie
    res.cookie("employee_refreshToken", employee_refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.json({ employee_accessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid refresh token" });
  }
};

export default refreshEmployeeToken;

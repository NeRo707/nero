import { Request, Response } from "express";
import { Company } from "../../../models/company";
import bcrypt from "bcrypt";
import { generateCompanyToken } from "../../../utils/generateToken";

/**
 * Handles the login process for a company, including validation, authentication, and token generation.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a Promise that resolves to void
 */
export const loginCompany = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // console.log(req.body);s

    const company = await Company.findOne({ where: { email } });

    // Check if the company exists
    if (!company) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    if (company.verified === false) {
      return res
        .status(401)
        .json({ success: false, error: "Please verify your email first" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      company.dataValues.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate and set a new JWT token
    const { owner_accessToken, owner_refreshToken } =
      await generateCompanyToken(res, company.dataValues.id);

    res.cookie("owner_refreshToken", owner_refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      owner_accessToken,
      message: "Login successful",
      data: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

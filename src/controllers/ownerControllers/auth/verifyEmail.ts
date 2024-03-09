import { Request, Response } from "express";
import { Company } from "../../../models/company";

/**
 * Verify the email using the token provided in the request query parameter
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a Promise that resolves to void
 */
export const verifyEmail = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, error: "Invalid token" });
    }

    const company = await Company.findOne({
      where: {
        email_verify_token: token,
      },
    });

    if (!company) {
      return res.status(400).json({ success: false, error: "Invalid token" });
    }

    await company.update({
      verified: true,
    });

    res.status(200).json({ success: true, message: "Email verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
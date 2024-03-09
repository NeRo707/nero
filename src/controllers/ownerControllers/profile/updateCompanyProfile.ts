import { Request, Response } from "express";
import { Company } from "../../../models/company";
import  bcrypt  from 'bcrypt';

import { TCustomRequestC as CustomRequest } from "../../../types/types";
/**
 * Update the company profile using the provided request data.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves to void
 */
export const updateCompanyProfile = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    // The company ID is extracted from the verified token in the middleware
    const companyId = req.companyId;

    // Fetch the company profile from the database using the company ID
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }

    // Update the company profile
    const { email, password, country, industry } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing password" });
    }

    let hashedPassword = null;
    // Hash the password if provided if not don't update company profile

    if (password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(password, 8);
    }

    const updatedCompany = await company.update({
      email,
      password: hashedPassword,
      country,
      industry,
    });

    // Respond with the updated company profile
    res.status(200).json({ success: true, data: updatedCompany });
  } catch (error: any) {
    // console.log(error.errors[0].message);
    res.status(500).json({
      success: false,
      error: "Server Error " + error.errors[0].message,
    });
  }
};
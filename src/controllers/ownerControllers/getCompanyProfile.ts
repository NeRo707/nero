import { Request, Response } from "express";
import { Company, Employee, Subscription } from "../../models/company";

import { TCustomRequestC as CustomRequest } from "../../types/types";
/**
 * Get the company profile, including employees, subscription, and company data.
 *
 * @param {CustomRequest} req - the request object containing company ID
 * @param {Response} res - the response object to send the company profile
 * @return {Promise<Response | void>} returns a Promise that resolves to void
 */
export const getCompanyProfile = async (req: CustomRequest, res: Response): Promise<Response | void> => {
  try {
    // The company ID is extracted from the verified token in the middleware
    const companyId = req.companyId;

    const employees = await Employee.findAll({
      where: {
        company_id: companyId,
      },
    });

    const subscription = await Subscription.findOne({
      where: {
        company_id: companyId,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!companyId) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized you are not owner" });
    }

    // Fetch the company profile from the database using the company ID
    const company = await Company.findByPk(companyId, {
      attributes: { exclude: ["password"] },
    });

    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }

    if (company.verified === false) {
      return res
        .status(401)
        .json({ success: false, error: "Please verify your email first" });
    }

    // Respond with the company profile
    res.status(200).json({
      success: true,
      subscription: subscription?.plan_name,
      companyData: company,
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
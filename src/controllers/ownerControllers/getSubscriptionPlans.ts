import { Request, Response } from "express";
import { Subscription } from "../../models/company";

/**
 * Retrieves subscription plans and updates their expiration dates.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves with the updated subscription plans
 */
export const getSubscriptionPlans = async (req: Request, res: Response): Promise<Response | void> => {
  const subscriptionPlans = await Subscription.findAll({
    where: {
      company_id: null,
    },
  });

  if (!subscriptionPlans) {
    return res
      .status(404)
      .json({ success: false, error: "Subscription plans not found" });
  }

  subscriptionPlans.forEach((plan) => {
    plan.expiration_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  });

  res.status(200).json({ success: true, data: subscriptionPlans });
};
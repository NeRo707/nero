import { Request, Response } from "express";
import { Billing, Subscription } from "../../../models/company";

import { TCustomRequestC as CustomRequest } from "../../../types/types";

/**
 * Retrieves the subscription status for a given company ID and sends the corresponding response.
 *
 * @param {CustomRequest} req - the custom request object containing the company ID
 * @param {Response} res - the response object for sending the status and data
 * @return {Promise<Response | void>} promise that resolves after sending the response
 */
export const getSubscriptionStatus = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  const companyId = req.companyId;

  const subscription = await Subscription.findOne({
    where: {
      company_id: companyId,
    },
    order: [["createdAt", "DESC"]],
  });

  const billing = await Billing.findOne({
    where: {
      company_id: companyId,
    },
    order: [["createdAt", "DESC"]],
  });

  // find out how much user has to pay at the end of month
  const unpaid = await Billing.findAll({
    where: {
      company_id: companyId,
      paid: false,
    },
  });

  const hasToPay = unpaid
    .map((bill) => bill.amount_due)
    .reduce((a, b) => a + b);

  console.log(subscription);
  console.log(billing);

  if (!subscription) {
    return res
      .status(404)
      .json({ success: false, error: "Subscription not found" });
  }

  if (!billing) {
    return res.status(404).json({ success: false, error: "Billing not found" });
  }

  res.status(200).json({ success: true, hasToPay, subscription, billing });
};

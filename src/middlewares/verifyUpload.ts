import { NextFunction, Response } from "express";
import { Files, Subscription } from "../models/company";
import { TCustomRequestC as CustomRequest } from "../types/types";

export const verifyUpload = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { companyId } = req;

  const subscription = await Subscription.findOne({
    where: { company_id: companyId },
    order: [["createdAt", "DESC"]],
  });

  if (!subscription) {
    return res.status(403).json({ message: "No subscription found" });
  }

  const { plan_name, expiration_date } = subscription;

  const limits: { [key: string]: number } = {
    free: 10,
    basic: 100,
    premium: 1000,
  };

  if (plan_name) {
    const count = await Files.count({
      where: { company_id: companyId },
    });

    const now = new Date();

    if (expiration_date < now) {
      return res.status(403).json({ message: `Subscription expired ${expiration_date.toLocaleString()} today's date is ${now.toLocaleString()}` });
    }

    if(plan_name === "premium" && count >= limits[plan_name]) {
      return res.status(403).json({ message: `You will pay additional fee of 0.5 for given file` });
    }

    if (count >= limits[plan_name]) {
      return res.status(403).json({
        message: `Upload limit reached for ${plan_name} plan you already have ${count} files uploaded `,
      });
    }
  } else {
    return res
      .status(403)
      .json({ message: "AMONGUS: You are not allowed to upload" });
  }
  next();
};

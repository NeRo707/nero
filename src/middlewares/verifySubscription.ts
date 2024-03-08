import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { Employee, Subscription } from "../models/company";

type CustomRequest = Request & {
  companyId?: number;
  subscription?: { type: string; expiryDate: Date };
};
const verifySubscription = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { companyId } = req;

  const subscription = await Subscription.findOne({
    where: {
      company_id: companyId,
    },
    order: [["createdAt", "DESC"]],
  })

  if (!subscription) {
    return res.status(403).send({ error: "No subscription found" });
  }

  const { plan_name, expiration_date } = subscription;
  const now = new Date();

  if (expiration_date < now) {
    return res.status(403).send({ error: "Subscription expired" });
  }

  const limits: { [key: string]: number } = {
    free: 0,
    basic: 9,
    premium: 99,
  };

  // Count the number of employees for the company
  const employeeCount = await Employee.count({
    where: {
      company_id: companyId,
    },
  });

  console.log(employeeCount, companyId);

  if (employeeCount > limits[plan_name]) {
    return res
      .status(403)
      .send({ error: `Employee limit reached for ${plan_name} subscription` });
  }
  
  next();
};

export default verifySubscription;

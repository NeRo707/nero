import { Request, Response } from "express";
import { Billing, Employee, Subscription } from "../../../models/company";

import { TCustomRequestC as CustomRequest } from "../../../types/types";
import { Op } from "sequelize";
/**
 * Asynchronous function to get subscription.
 *
 * @param {CustomRequest} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response | void>} - A Promise that resolves with the response object.
 */
export const getSubscription = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  const companyId = req.companyId;
  const { plan } = req.params;

  try {
    console.log(plan);
    //make subscription
    const subscriptionData = await Subscription.findOne({
      where: {
        plan_name: plan,
      },
    });

    if (!subscriptionData) {
      return res.status(404).json({ success: false, error: "Plan not found" });
    }

    const {
      max_files_per_month,
      max_users,
      price_per_user,
      fixed_price,
      additional_file_cost,
    } = subscriptionData;

    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // a month from now

    const currentSubscription = await Subscription.findOne({
      where: {
        company_id: companyId,
        id: {
          [Op.ne]: subscriptionData.id, // Exclude the current subscription ID
        },
        expiration_date: {
          [Op.gte]: new Date(), // Check for active subscriptions (not expired)
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (currentSubscription && currentSubscription.plan_name === plan) {
      return res.status(400).json({
        success: false,
        error: "You already have an active subscription for this plan.",
      });
    }

    if (currentSubscription && currentSubscription.plan_name !== plan) {
      // Count the number of employees for the company
      const employeeCount = await Employee.count({
        where: {
          company_id: companyId,
        },
      });

      console.log(employeeCount, max_users);

      if (employeeCount > max_users) {
        const employees = await Employee.findAll({
          where: {
            company_id: companyId,
          },
          order: [["createdAt", "ASC"]],
          limit: employeeCount - max_users,
        });

        for (const employee of employees) {
          // Unlink the employee from the company
          await employee.update({
            company_id: null,
          });
        }
      }
    }

    const subscription = await Subscription.create({
      company_id: companyId,
      plan_name: plan,
      max_files_per_month,
      max_users,
      price_per_user,
      fixed_price,
      additional_file_cost,
      expiration_date: expirationDate,
    });

    const billingPeriodStart = new Date();
    const billingPeriodEnd = new Date(
      billingPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days
    );

    const employeeCount = await Employee.count({
      where: {
        company_id: companyId,
      },
    });

    let amountDue;

    switch (plan) {
      case "free":
        amountDue = 0;
        break;
      case "basic":
        if (employeeCount <= 1) {
          amountDue = 5;
        } else {
          amountDue = 5 + (employeeCount - 1) * price_per_user;
        }
        break;
      case "premium":
        amountDue = fixed_price;
        break;
      default:
        return res
          .status(404)
          .json({ success: false, error: "Plan not found" });
    }

    const billingRecord = await Billing.create({
      company_id: companyId,
      subscription_id: subscription.id,
      start_date: billingPeriodStart,
      end_date: billingPeriodEnd,
      amount_due: amountDue,
    });

    res.status(200).json({
      success: true,
      data: subscription,
      billing: billingRecord,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

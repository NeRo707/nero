import { Request, Response } from "express";
import crypto from "crypto";
import { generateEmailConfirmationToken } from "../../../utils/genEmailToken";
import { Employee, Subscription, Billing } from "../../../models/company";
import transporter from "../../../config/nodemailerConfig";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

type CustomRequest = Request & { companyId?: number };

export const addEmployee = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  const { companyId } = req;

  const { email } = req.body;
  console.log(req.body);
  console.log(companyId);
  if (!email || !companyId) {
    return res.status(400).json({
      message:
        "Missing required fields must include email and be a company owner",
    });
  }

  // hash the password
  const randomHash = crypto.randomBytes(32).toString("hex");
  const emailToken = generateEmailConfirmationToken();

  // Add the employee to the database
  try {
    // Check if the employee exists
    const employeeExists = await Employee.findOne({
      where: {
        email,
      },
    });

    if (employeeExists) {
      await employeeExists.update({
        company_id: companyId,
        email_verify_token: emailToken,
      });

      // Update the billing record based on the subscription plan
      await updateBillingRecord(companyId);

      // Send email to employee
      const mailOptions = {
        from: "botnetx1@gmail.com",
        to: employeeExists.email,
        subject: "Account Verification",
        html: `
          <p>Hello ${employeeExists.email},</p>
          <p>Thank you for registering with our platform. Please verify your email by clicking the link below: and inputting password <POST in POSTMAN></p>
          <a href="http://localhost:${PORT}/company/employee/verify?token=${emailToken}&password">Verify Email</a>
        `,
      };

      await transporter.sendMail(mailOptions);

      return res
        .status(200)
        .json({ message: "Existing Employee added successfully" });
    }

    // Create the employee
    const newEmployee = await Employee.create({
      company_id: companyId,
      email,
      password: randomHash,
      email_verify_token: emailToken,
    });

    // Update the billing record based on the subscription plan
    await updateBillingRecord(companyId);

    // Send a success response
    if (newEmployee) {
      // Send email
      const mailOptions = {
        from: "botnetx1@gmail.com",
        to: newEmployee.email,
        subject: "Account Verification",
        html: `
          <p>Hello ${newEmployee.email},</p>
          <p>Thank you for registering with our platform. Please verify your email by clicking the link below:</p>
          <a href="http://localhost:${PORT}/company/employee/verify?token=${emailToken}&password">Verify Email</a>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error company does not exist?" });
  }
};

const updateBillingRecord = async (companyId: number) => {
  try {
    // Get the current subscription plan for the company
    const subscription = await Subscription.findOne({
      where: { company_id: companyId },
    });

    if (!subscription) {
      console.log("No subscription found for the company");
      return;
    }

    const { plan_name, price_per_user, fixed_price } = subscription;

    // Count the number of employees for the company
    const employeeCount = await Employee.count({
      where: { company_id: companyId },
    });

    // Calculate the new amount due based on the subscription plan and employee count
    let amountDue;
    switch (plan_name) {
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
        console.log("Invalid subscription plan");
        return;
    }

    // Update the billing record with the new amount due
    const billingRecord = await Billing.findOne({
      where: { company_id: companyId },
      order: [["createdAt", "DESC"]],
    });

    if (billingRecord) {
      await billingRecord.update({ amount_due: amountDue });
    } else {
      console.log("No billing record found for the company");
    }
  } catch (error) {
    console.log(error);
  }
};
import { Request, Response } from "express";
import crypto from 'crypto';
import { generateEmailConfirmationToken } from "../../utils/genEmailToken";
import { Employee } from "../../models/company";
import transporter from "../../config/nodemailerConfig";

type CustomRequest = Request & { companyId?: number };
/**
 * Asynchronous function to add an employee to the database.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves to void
 */
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

      //send email to employee
      const mailOptions = {
        from: "botnetx1@gmail.com",
        to: employeeExists.email,
        subject: "Account Verification",
        html: `
            <p>Hello ${employeeExists.email},</p>
            <p>Thank you for registering with our platform. Please verify your email by clicking the link below: and inputting password <POST></p>
            <a href="http://localhost:3000/company/employee/verify?token=${emailToken}">Verify Email</a>
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

    // Send a success response
    if (newEmployee) {
      // generateEmployeeToken(res, newEmployee.dataValues.id);
      // send email
      const mailOptions = {
        from: "botnetx1@gmail.com",
        to: newEmployee.email,
        subject: "Account Verification",
        html: `
          <p>Hello ${newEmployee.email},</p>
          <p>Thank you for registering with our platform. Please verify your email by clicking the link below:</p>
          <a href="http://localhost:3000/company/employee/verify?token=${emailToken}">Verify Email</a>
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

import { Request, Response } from "express";
import  bcrypt  from 'bcrypt';
import { generateEmailConfirmationToken } from "../../utils/genEmailToken";
import { Company } from "../../models/company";
import transporter from "../../config/nodemailerConfig";

/**
 * Registers a new company using the provided request data, including company name, email, password, country, and industry.
 *
 * @param {Request} req - the request object containing the company registration data
 * @param {Response} res - the response object used to send the registration status and data
 * @return {Promise<Response | void>} a promise that resolves with the registration status and data
 */
export const registerCompany = async (req: Request, res: Response): Promise<Response | void> => {
  const { company_name, email, password, country, industry } = req.body;

  if (!company_name || !email || !password || !country || !industry) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  let hashedPassword = await bcrypt.hash(password, 8);
  const emailToken = generateEmailConfirmationToken();

  try {
    // Create a new company using Sequelize model
    const newCompany = await Company.create({
      company_name,
      email,
      password: hashedPassword,
      country,
      industry,
      email_verify_token: emailToken,
    });

    // Additional logic like sending activation email, etc.
    // console.log(newCompany.dataValues);

    if (newCompany) {
      const mailOptions = {
        from: "botnetx1@gmail.com",
        to: newCompany.email,
        subject: "Account Verification",
        html: `
          <p>Hello ${newCompany.company_name},</p>
          <p>Thank you for registering with our platform. Please verify your email by clicking the link below:</p>
          <a href="http://localhost:3000/company/verify?token=${emailToken}">Verify Email</a>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ success: true, data: newCompany });
  } catch (error: any) {
    // console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Server Error email already exists?" });
  }

  // console.log(hashedPassword);
};
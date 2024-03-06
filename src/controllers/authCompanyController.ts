import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Company, Employee, Subscription } from "../models/company";
import transporter from "../config/nodemailerConfig";
import { generateEmailConfirmationToken } from "../utils/genEmailToken";
import { generateCompanyToken } from "../utils/generateToken";

/* 
  @desc      login Company/set token
  -route     POST /company/login
  @access    Public
*/
const loginCompany = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // console.log(req.body);s

    const company = await Company.findOne({ where: { email } });

    // Check if the company exists
    if (!company) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    if (company.verified === false) {
      return res
        .status(401)
        .json({ success: false, error: "Please verify your email first" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      company.dataValues.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate and set a new JWT token
    const { owner_accessToken, owner_refreshToken } =
      await generateCompanyToken(res, company.dataValues.id);

    res.cookie("owner_refreshToken", owner_refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      owner_accessToken,
      message: "Login successful",
      data: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/* 
  @desc      Register Company
  -route     POST /company/register
  @access    Public
*/

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, error: "Invalid token" });
    }

    const company = await Company.findOne({
      where: {
        email_verify_token: token,
      },
    });

    if (!company) {
      return res.status(400).json({ success: false, error: "Invalid token" });
    }

    await company.update({
      verified: true,
    });

    res.status(200).json({ success: true, message: "Email verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const registerCompany = async (req: Request, res: Response) => {
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

/* 
  @desc      Logout Company
  route      POST /company/logout
  @access    Public
*/
const logoutCompany = async (req: Request, res: Response) => {
  res.cookie("owner_refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Company Logged Out" });
};

/* 
  @desc      Get Company Profile
  route      GET /company/profile
  @access    Private
*/

type CustomRequest = Request & { companyId?: number };
const getCompanyProfile = async (req: CustomRequest, res: Response) => {
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

/* 
  @desc      Update Company Profile
  route      PUT /company/profile
  @access    Private
*/
const updateCompanyProfile = async (req: CustomRequest, res: Response) => {
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

const getSubscriptionStatus = async (req: CustomRequest, res: Response) => {
  const companyId = req.companyId;

  const subscription = await Subscription.findOne({
    where: {
      company_id: companyId,
    },
    order: [["createdAt", "DESC"]],
  });

  console.log(subscription);

  if (!subscription) {
    return res
      .status(404)
      .json({ success: false, error: "Subscription not found" });
  }

  res.status(200).json({ success: true, data: subscription });
};

const getSubscriptionPlans = async (req: CustomRequest, res: Response) => {
  const subscriptionPlans = await Subscription.findAll({
    where: {
      company_id: null,
    },
  });
  res.status(200).json({ success: true, data: subscriptionPlans });
};

const getSubscription = async (req: CustomRequest, res: Response) => {
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

    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

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

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export {
  loginCompany,
  registerCompany,
  logoutCompany,
  getCompanyProfile,
  updateCompanyProfile,
  verifyEmail,
  getSubscriptionStatus,
  getSubscriptionPlans,
  getSubscription,
};

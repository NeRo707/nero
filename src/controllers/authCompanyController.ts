import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Company, Employee, Subscription } from "../models/company";
import transporter from "../config/nodemailerConfig";
import { generateEmailConfirmationToken } from "../utils/genEmailToken";
import { generateCompanyToken } from "../utils/generateToken";
import crypto from "crypto";


/**
 * Handles the login process for a company, including validation, authentication, and token generation.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a Promise that resolves to void
 */
const loginCompany = async (req: Request, res: Response): Promise<Response | void> => {
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



/**
 * Verify the email using the token provided in the request query parameter
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a Promise that resolves to void
 */
const verifyEmail = async (req: Request, res: Response): Promise<Response | void> => {
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

/**
 * Registers a new company using the provided request data, including company name, email, password, country, and industry.
 *
 * @param {Request} req - the request object containing the company registration data
 * @param {Response} res - the response object used to send the registration status and data
 * @return {Promise<Response | void>} a promise that resolves with the registration status and data
 */
const registerCompany = async (req: Request, res: Response): Promise<Response | void> => {
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


/**
 * Logs out the company by clearing the owner refreshToken cookie and sending a 200 status with a JSON message.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves to void
 */
const logoutCompany = async (req: Request, res: Response): Promise<Response | void> => {
  res.cookie("owner_refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Company Logged Out" });
};



type CustomRequest = Request & { companyId?: number };
/**
 * Get the company profile, including employees, subscription, and company data.
 *
 * @param {CustomRequest} req - the request object containing company ID
 * @param {Response} res - the response object to send the company profile
 * @return {Promise<Response | void>} returns a Promise that resolves to void
 */
const getCompanyProfile = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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


/**
 * Update the company profile using the provided request data.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves to void
 */
const updateCompanyProfile = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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

    if (!password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing password" });
    }

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

/**
 * Retrieves the subscription status for a given company ID and sends the corresponding response.
 *
 * @param {CustomRequest} req - the custom request object containing the company ID
 * @param {Response} res - the response object for sending the status and data
 * @return {Promise<Response | void>} promise that resolves after sending the response
 */
const getSubscriptionStatus = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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

/**
 * Retrieves subscription plans and updates their expiration dates.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves with the updated subscription plans
 */
const getSubscriptionPlans = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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

/**
 * Asynchronous function to get subscription.
 * 
 * @param {CustomRequest} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response | void>} - A Promise that resolves with the response object.
 */
const getSubscription = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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

    const currentSubscription = await Subscription.findOne({
      where: {
        company_id: companyId,
      },
      order: [["createdAt", "DESC"]],
    });

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

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

/**
 * Asynchronous function to add an employee to the database.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves to void
 */
const addEmployee = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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

/**
 * Remove an employee from the system.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves when the employee is successfully removed
 */
const removeEmployee = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    console.log(req.params);
    if (!id) {
      return res.status(400).json({ message: "employee not found wrong id?" });
    }

    const employee = await Employee.findByPk(id);
    console.log(employee);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }

    await employee.update({ company_id: null, verified: false });

    res.status(200).json({ message: "employee has been FIRED successfully" });
  } catch (err) {
    console.log(err);
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
  addEmployee,
  removeEmployee,
};
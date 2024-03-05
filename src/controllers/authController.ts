import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Company from "../models/company";
import generateToken from "../utils/generateToken";
import { TCompany } from "../types/types";
import crypto from 'crypto';

/* 
  @desc      login Company/set token
  -route     POST /company/login
  @access    Public
*/
const loginCompany = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the company by email
    const company = await Company.findOne({ where: { email } });

    // Check if the company exists
    if (!company) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
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
    generateToken(res, company.dataValues.id);

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: company });
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

const generateConfirmationToken = (): string => {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
};


const registerCompany = async (req: Request, res: Response) => {
  const { company_name, email, password, country, industry } = req.body;

  let hashedPassword = await bcrypt.hash(password, 8);

  try {
    // Create a new company using Sequelize model
    const newCompany = await Company.create({
      company_name,
      email,
      password: hashedPassword,
      country,
      industry,
    });

    // Additional logic like sending activation email, etc.
    console.log(newCompany.dataValues);

    if (newCompany) {
      generateToken(res, newCompany.dataValues.id);
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
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
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
    // console.log(req);
    // Fetch the company profile from the database using the company ID
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }

    // Respond with the company profile
    res.status(200).json({ success: true, data: company });
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
const updateCompanyProfile = async (req: Request, res: Response) => {
  res.send("updateCompanyProfile");
};

export {
  loginCompany,
  registerCompany,
  logoutCompany,
  getCompanyProfile,
  updateCompanyProfile,
};

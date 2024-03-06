import { Request, Response } from "express";
import { Employee } from "../models/company";
import bcrypt from "bcrypt";
import { generateEmployeeToken } from "../utils/generateToken";
import transporter from "../config/nodemailerConfig";
import { generateEmailConfirmationToken } from "../utils/genEmailToken";
// import RefreshToken from "../models/refreshtoken";
import crypto from "crypto";

type CustomRequest = Request & { employeeId?: number; companyId?: number };

const verifyEmployee = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { token } = req.query;
    console.log(req.query);

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Invalid token or you did not include password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.findOne({
      where: {
        email_verify_token: token,
      },
    });

    if (!employee) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const updatedEmployee = await employee.update({
      verified: true,
      password: hashedPassword,
    });

    if (!updatedEmployee) {
      return res.status(400).json({ message: "Invalid token2" });
    }

    res.status(200).json({ message: "Email verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error employee verification" });
  }
};

const getEmployeeProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { employeeId } = req;

    if (!employeeId) {
      return res.status(401).json({ message: "EmployeeId not found" });
    }

    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found in database" });
    }

    res.status(200).json({ data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error employee profile" });
  }
};

const addEmployee = async (req: CustomRequest, res: Response) => {
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
            <p>Thank you for registering with our platform. Please verify your email by clicking the link below:</p>
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

const removeEmployee = async (req: Request, res: Response) => {
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

    res.status(200).json({ message: "employee removed successfully" });
  } catch (err) {
    console.log(err);
  }
};

const logoutEmployee = (req: Request, res: Response) => {
  res.cookie("employee_refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // req.headers.authorization = "";

  console.log();

  res.status(200).json({ message: "Employee Logged Out" });
};

const authEmployee = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Find the employee in the database
  const employee = await Employee.findOne({
    where: {
      email,
    },
  });

  if (!employee) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log(employee.dataValues);

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(
    password,
    employee.dataValues.password
  );

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check if the employee is verified
  if (employee.dataValues.verified === false) {
    return res.status(401).json({ message: "Please verify your email first" });
  }

  // Create a JWT token
  const { employee_accessToken, employee_refreshToken } =
    await generateEmployeeToken(res, employee.dataValues.id);

  // console.log(employee.dataValues);

  res.cookie("employee_refreshToken", employee_refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: "Login successful",
    accessToken: employee_accessToken,
  });
};

export {
  addEmployee,
  removeEmployee,
  authEmployee,
  logoutEmployee,
  verifyEmployee,
  getEmployeeProfile,
};

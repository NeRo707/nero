import { Request, Response } from "express";
import { Employee, Files } from "../models/company";
import bcrypt from "bcrypt";
import { generateEmployeeToken } from "../utils/generateToken";

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

  console.log("DB-Employee: ",employee);

  if (!employee) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (employee.dataValues.verified === false) {
    return res.status(401).json({ message: "Please verify your email first" });
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

const getFiles = async (req: any, res: Response) => {
  const { employeeId } = req;

  console.log(req.body);
  if (!employeeId) {
    return res.status(400).json({ message: "Missing employee id" });
  }

  const employee = await Employee.findByPk(employeeId);

  console.log(employee);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const workFiles = await Files.findAll({
    where: {
      employee_id: employeeId,
    },
  });

  const sharedFiles = await Files.findAll({
    where: {
      shared_with_all: true,
    },
  });

  console.log(workFiles);

  res.status(200).json({ assignedFiles: workFiles, sharedFiles: sharedFiles });
};

export {
  authEmployee,
  logoutEmployee,
  verifyEmployee,
  getEmployeeProfile,
  getFiles,
};

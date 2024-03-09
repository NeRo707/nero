import { Request, Response } from "express";
import { Employee } from "../../../models/company";
import bcrypt from "bcrypt";
import { generateEmployeeToken } from "../../../utils/generateToken";


export const authEmployee = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;
  console.log(req.body);
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
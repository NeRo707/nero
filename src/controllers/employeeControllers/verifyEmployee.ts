import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Employee } from "../../models/company";

/**
 * Verify employee with provided token and password.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} Promise that resolves with the verification result
 */
export const verifyEmployee = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { token, password } = req.query as { token: string; password: string };
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

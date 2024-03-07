import { Request, Response } from "express";

/**
 * Logs out the employee by clearing the refresh token cookie and setting the authorization header to an empty string.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {void}
 */
export const logoutEmployee = (req: Request, res: Response): void => {
  res.cookie("employee_refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // req.headers.authorization = "";

  // console.log();

  res.status(200).json({ message: "Employee Logged Out" });
};

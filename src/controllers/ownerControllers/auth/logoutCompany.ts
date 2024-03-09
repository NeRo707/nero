import { Request, Response } from "express";

/**
 * Logs out the company by clearing the owner refreshToken cookie and sending a 200 status with a JSON message.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {void}
 */
export const logoutCompany = (req: Request, res: Response): void => {
  res.cookie("owner_refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Company Logged Out" });
};

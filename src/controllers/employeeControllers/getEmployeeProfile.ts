import { Response } from "express";
import { TCustomRequestE as CustomRequest } from "../../types/types";
import { Employee } from "../../models/company";

/**
 * Retrieves the employee profile based on the given employeeId in the request.
 *
 * @param {CustomRequest} req - the custom request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a Promise that resolves when the employee profile is retrieved
 */
export const getEmployeeProfile = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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

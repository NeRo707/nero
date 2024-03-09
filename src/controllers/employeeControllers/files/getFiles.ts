
import { Response } from "express";
import { TCustomRequestE as CustomRequest } from "../../../types/types";
import { Employee, Files } from "../../../models/company";

/**
 * Retrieves the files associated with a specific employee and returns them as assigned and shared files.
 *
 * @param {CustomRequest} req - the custom request object containing employeeId
 * @param {Response} res - the response object for sending the result
 * @return {Promise<Response | void>} a promise that resolves when the files are retrieved and sent as a response
 */
export const getFiles = async (req: CustomRequest, res: Response): Promise<Response | void> => {
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
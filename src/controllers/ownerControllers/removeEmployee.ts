import { Request, Response } from "express";
import { Employee } from "../../models/company";

/**
 * Remove an employee from the system.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<Response | void>} a promise that resolves when the employee is successfully removed
 */
export const removeEmployee = async (req: Request, res: Response): Promise<Response | void> => {
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
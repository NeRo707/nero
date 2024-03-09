import { Request, Response } from "express";
import { Employee, Files } from "../../../models/company";

const getEmployees = async (
) => {
  
}

export const getAllFiles = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  // Create a sample file
  const files = await Files.findAll();
  if(!files) {
    return res.status(404).json({ message: "No files found" });
  }
  return res.status(200).json(files);
};

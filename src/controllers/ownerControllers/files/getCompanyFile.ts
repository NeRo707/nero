import { Request, Response } from "express";
import { Employee, Files } from "../../../models/company";

export const getCompanyFile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;

  if(!id) {
    return res.status(400).json({ message: "Missing file id" });
  }
  //search file & who have access to this file
  const file = await Files.findAll({
    include: [
      {
        model: Employee,
        through: {
          where: { file_id: id },
          attributes: [],
        },
      },
    ],
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  // console.log(file);

  return res.status(200).json({ file });
};

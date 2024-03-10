import { Request, Response } from "express";
import { Files } from "../../../models/company";
import { TCustomRequestC as CustomRequest } from "../../../types/types";

export const getAllFiles = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  const { companyId } = req;

  console.log(companyId);

  //find all files
  const files = await Files.findAll({
    where: {
      company_id: companyId,
    },
  });

  if (files.length > 0) {
    return res.status(200).json(files);
  }

  return res.status(404).json({ message: "No files found" });
};

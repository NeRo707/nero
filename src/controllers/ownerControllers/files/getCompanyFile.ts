import { Request, Response } from "express";
import { Company, FileEmployeeMapping, Files } from "../../../models/company";
import { TCustomRequestC as CustomRequest } from "../../../types/types";

export const getCompanyFile = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  const { companyId } = req;
  console.log(id);
  try {
    if (!Number(id)) {
      return res.status(400).json({ message: "Missing file id" });
    }

    //search file & who have access to this file

    if (Number(id)) {
      const fileEmployeeMappings: any = await FileEmployeeMapping.findAll({
        where: { id },
        attributes: [],
        include: [
          {
            model: Files,
            where: {
              company_id: companyId,
            },
            attributes: [
              "id",
              "file_name",
              "file_type",
              "shared_with_all",
              "company_id",
            ],
          },
        ],
      });

      const files = fileEmployeeMappings.map(
        (files: any) => files.File.dataValues
      );

      console.log(files);

      if (files.length > 0) {
        return res.status(200).json(files);
      }

      return res.status(404).json({ message: "File not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

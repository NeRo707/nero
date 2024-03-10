import { Response } from "express";
import { Employee, FileEmployeeMapping, Files } from "../../../models/company";
import { TCustomRequestE as CustomRequest } from "../../../types/types";

export const getEmployeeFiles = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  const { employeeId } = req;
  console.log(Number(id), employeeId);

  try {
    if (!Number(id)) {
      // Search for all files belonging to this employee
      const fileEmployeeMappings = await FileEmployeeMapping.findAll({
        where: { employee_id: employeeId },
        attributes: [],
        include: [
          {
            model: Files,
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

      const sharedFiles = await Files.findAll({
        where: {
          shared_with_all: true,
        },
        attributes: [
          "id",
          "file_name",
          "file_type",
          "shared_with_all",
          "company_id",
        ],
      });

      const files = fileEmployeeMappings.map((mapping: any) => mapping.File);

      console.log(files);

      if (files.length === 0 && sharedFiles.length === 0) {
        return res.status(404).json({ message: "No files found" });
      }

      return res.status(200).json({ files, sharedFiles });
    }

    if (Number(id)) {
      // Handle the case when an id is provided
      const fileEmployeeMapping: any = await FileEmployeeMapping.findOne({
        where: {
          file_id: Number(id),
          employee_id: employeeId,
        },
        attributes: [],
        include: [
          {
            model: Files,
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

      if (!fileEmployeeMapping) {
        return res.status(404).json({ message: "File not found" });
      }

      const file = fileEmployeeMapping.File;

      return res.status(200).json({ file });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

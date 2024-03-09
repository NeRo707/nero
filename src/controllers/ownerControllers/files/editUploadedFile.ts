import { Request, Response } from "express";
import { TCustomRequestC as CustomRequest } from "../../../types/types";
import { Files } from "../../../models/company";

export const editUploadedFile = async (
  req: CustomRequest,
  res: Response
): Promise<Response | void> => {
  console.log(req.companyId);
  console.log(req.params);

  const { companyId } = req;
  const { id, visibility } = req.params;
  const { newName, shared_with } = req.body;

  if (!companyId) {
    return res.status(400).json({
      message:
        "Missing company id you are not company owner you cannot edit owners files",
    });
  }

  if (!id) {
    return res.status(400).json({ message: "Missing file id" });
  }

  if (!visibility) {
    return res
      .status(400)
      .json({ message: "Missing file visibility parameter" });
  }

  try {
    const file = await Files.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileData = {
      file_name: newName ? newName : file.file_name,
      shared_with_all: visibility === "public",
    };

    await Files.update(fileData, {
      where: { id: id, company_id: companyId },
    });

    if (shared_with) {
      const sharedWith = shared_with
        .split(",")
        .map((item: string) => item.match(/\d+/))
        .filter(Boolean)
        .map(Number);

      await file.setEmployees([]);

      if (sharedWith[0] === 0) {
        await file.setEmployees([]);
        return res
          .status(200)
          .json({ message: "File Updated", data: fileData });
      }
      try {
        await file.addEmployees(sharedWith);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    return res.status(200).json({ message: "File Updated", data: fileData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

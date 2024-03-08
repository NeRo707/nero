import { Response } from "express";
import { TCustomRequestC as CustomRequest } from "../../types/types";
import { Files } from "../../models/company";

export const uploadCompanyFile = async (req: CustomRequest, res: Response) => {
  const { visibility } = req.params;
  const { companyId } = req;

  if (!companyId) {
    return res.status(400).json({ message: "Missing company id" });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  const acceptedFileExtensions = ["csv", "xlsx", "xls"];

  const fileExt = file?.originalname.split(".").pop();

  // console.log(fileExt);
  // console.log(companyId);

  if (fileExt) {
    try {
      console.log(file);

      const { originalname, mimetype } = file;

      const fileData = {
        company_id: companyId,
        file_name: originalname,
        file_type: mimetype.split("/")[1],
        shared_with_all: visibility === "public",
      };

      const newFileDoc = await Files.create(fileData);

      // console.log(newFileDoc);

      // const fileDoc = await Files.create(fileData);

      // console.log(fileData);

      // await fileDoc.save();
      return res
        .status(200)
        .json({ message: "File uploaded successfully", data: newFileDoc });
    } catch (error) {
      console.log(error);
    }
    if (!acceptedFileExtensions.includes(fileExt)) {
      return res.status(400).json({
        message: `File extension ${fileExt} is not accepted, only ${acceptedFileExtensions.join(
          ", "
        )} are allowed`,
      });
    }
  } else {
    return res.status(400).json({ message: "File extension is required" });
  }

  // console.log(file);

  // req.file contains information about the uploaded file
  // Store file metadata in database
  // Return response
};

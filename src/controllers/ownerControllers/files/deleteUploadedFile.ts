import { Request, Response } from "express";
import { Files } from "../../../models/company";

export const deleteUploadedFile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing file id" });
  }
  try {
    const file = await Files.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    await file.destroy();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

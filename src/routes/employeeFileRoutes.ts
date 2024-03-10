import express from "express";
import multer from "multer";
import {
  editUploadedFile,
  getEmployeeFiles,
  uploadEmployeeFile,
} from "../controllers";
import { verifyEmployeeToken } from "../middlewares";
import { verifyUpload } from "../middlewares/auth/verifyUpload";
import { deleteEmployeeFile } from "../controllers/employeeControllers/files/deleteEmployeeFile";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload a new Employee file
//Employee/file
router.post(
  "/:visibility",
  upload.single("file"),
  verifyEmployeeToken,
  verifyUpload,
  uploadEmployeeFile
);

//Edit a Employee file
//company/employee/file/:id
router.patch("/:visibility/:id", verifyEmployeeToken, editUploadedFile);

// Get a single file if :id is included else get all files
//company/employee/file/:id
router.get("/", verifyEmployeeToken, getEmployeeFiles);
router.get("/:id", verifyEmployeeToken, getEmployeeFiles);

// Update file access permissions
//company/employee/file/:id
router.put("/:id", verifyEmployeeToken, editUploadedFile);

// Delete a file
//company/employee/file/:id
router.delete("/:id", verifyEmployeeToken, deleteEmployeeFile);

export default router;

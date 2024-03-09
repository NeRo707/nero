import express from "express";
import multer from "multer";
import {
  deleteUploadedFile,
  editUploadedFile,
  getCompanyFile,
  uploadCompanyFile,
} from "../controllers";
import { verifyOwnerToken } from "../middlewares";
import { verifyUpload } from "../middlewares/auth/verifyUpload";
import { getAllFiles } from "../controllers/ownerControllers/files/getAllFiles";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload a new Company file
//company/file
router.post(
  "/:visibility",
  upload.single("file"),
  verifyOwnerToken,
  verifyUpload,
  uploadCompanyFile
);

//Edit a Company file
//company/file/:id
router.patch("/:visibility/:id", verifyOwnerToken, editUploadedFile);

// Get list of Company files
//company/file
router.get("/", verifyOwnerToken, getAllFiles);

// router
//   .route("/:id")
//   .get(verifyOwnerToken, getCompanyFile)
//   .put(verifyOwnerToken, editUploadedFile)
//   .delete(verifyOwnerToken, deleteUploadedFile);

// Get a single file
//company/file/:id
router.get("/:id/", verifyOwnerToken, getCompanyFile);

// Update file access permissions
//company/file/:id
router.put("/:id", verifyOwnerToken, editUploadedFile);

// Delete a file
//company/file/:id
router.delete("/:id", verifyOwnerToken, deleteUploadedFile);

export default router;

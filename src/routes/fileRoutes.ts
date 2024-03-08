import express from "express";
import multer from "multer";
import { editUploadedFile, getCompanyFile, uploadCompanyFile } from "../controllers";
import { verifyOwnerToken } from "../middlewares";
import { verifyUpload } from "../middlewares/verifyUpload";
import { getAllFiles } from "../controllers/ownerControllers/getAllFiles";

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


// Get a single file
router.get('/:id/', verifyOwnerToken, getCompanyFile);

// Update file access permissions
router.put("/:id", async (req, res) => {
  // Validate req.params.id and req.body
  // Update file in database
  // Return response
});

// Delete a file
router.delete("/:id", async (req, res) => {
  // Validate req.params.id
  // Delete file from database
  // Return response
});

export default router;

import express from "express";
const router = express.Router();

import {
  loginCompany,
  registerCompany,
  logoutCompany,
  updateCompanyProfile,
  getCompanyProfile,
  verifyEmail,
} from "../controllers/authCompanyController";

import verifyOwnerToken from "../middlewares/authCompanyMiddleware";

router.get("/verify", verifyEmail);
router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.post("/logout", logoutCompany);
router
  .route("/profile")
  .get(verifyOwnerToken, getCompanyProfile)
  .put(verifyOwnerToken, updateCompanyProfile);

export default router;

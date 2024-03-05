import express from "express";
const router = express.Router();

import {
  loginCompany,
  registerCompany,
  logoutCompany,
  updateCompanyProfile,
  getCompanyProfile,
} from "../controllers/authController";
import verifyToken from "../middlewares/authMiddleware";


router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.post("/logout", logoutCompany);
router.route("/profile").get(verifyToken, getCompanyProfile).put(verifyToken, updateCompanyProfile);


export default router;
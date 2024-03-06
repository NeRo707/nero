import express from "express";
const router = express.Router();

import {
  loginCompany,
  registerCompany,
  logoutCompany,
  updateCompanyProfile,
  getCompanyProfile,
  verifyEmail,
  getSubscriptionStatus,
  getSubscriptionPlans,
  getSubscription,
} from "../controllers/authCompanyController";

import verifyOwnerToken from "../middlewares/authCompanyMiddleware";

router.get("/subscription/status", verifyOwnerToken, getSubscriptionStatus);
router.get("/subscription/plans", verifyOwnerToken, getSubscriptionPlans);
router.post('/subscription/:plan', verifyOwnerToken, getSubscription);
router.get("/verify", verifyEmail); //v
router.post("/register", registerCompany); //v
router.post("/login", loginCompany); // v
router.post("/logout", logoutCompany); // v
router
  .route("/profile")
  .get(verifyOwnerToken, getCompanyProfile)
  .put(verifyOwnerToken, updateCompanyProfile);

export default router;

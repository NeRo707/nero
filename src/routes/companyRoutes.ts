import express from "express";
const router = express.Router();

import {
  addEmployee,
  getCompanyProfile,
  getSubscription,
  getSubscriptionPlans,
  getSubscriptionStatus,
  loginCompany,
  logoutCompany,
  registerCompany,
  removeEmployee,
  updateCompanyProfile,
  verifyEmail,
} from "../controllers";


import {
  refreshOwnerToken,
  verifyOwnerToken,
  verifySubscription,
} from "../middlewares";

router.get("/subscription/status", verifyOwnerToken, getSubscriptionStatus); // v
router.get("/subscription/plans", verifyOwnerToken, getSubscriptionPlans); // v
router.post("/subscription/:plan", verifyOwnerToken, getSubscription); // v

router.post(
  "/register/employee",
  verifyOwnerToken,
  verifySubscription,
  addEmployee
); //v

router.delete("/:id", verifyOwnerToken, removeEmployee); // v
router.get("/verify", verifyEmail); //v
router.post("/register", registerCompany); //v
router.post("/login", loginCompany); // v
router.post("/logout", logoutCompany); // v
router.post("/refresh_token", refreshOwnerToken);

router
  .route("/profile")
  .get(verifyOwnerToken, getCompanyProfile)
  .put(verifyOwnerToken, updateCompanyProfile);

export default router;

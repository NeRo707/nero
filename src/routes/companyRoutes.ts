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
  addEmployee,
  removeEmployee,
} from "../controllers/authCompanyController";

import verifyOwnerToken from "../middlewares/authCompanyMiddleware";
import verifySubscription from "../middlewares/verifySubscription";
import refreshOwnerToken from "../middlewares/refreshOwnerToken";

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
router.post('/refresh_token', refreshOwnerToken);

router
  .route("/profile")
  .get(verifyOwnerToken, getCompanyProfile)
  .put(verifyOwnerToken, updateCompanyProfile);

export default router;

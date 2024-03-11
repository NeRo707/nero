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
  verifyCompany,
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

router.delete("/employee/:id", verifyOwnerToken, removeEmployee); // v
router.get("/verify", verifyCompany); //v

router.post("/register", registerCompany); //v
router.post("/login", loginCompany); // v
router.post("/logout", logoutCompany); // v
router.post("/refresh_token", refreshOwnerToken);
router
  .route("/profile")
  .get(verifyOwnerToken, getCompanyProfile)
  .patch(verifyOwnerToken, updateCompanyProfile);
// -------------------------------------- OPENAPI ------------------------------------
  /**
 * @openapi
 * paths:
 *  /company/employee/:id:
 *   delete:
 *     tags: [Company]
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Employee has been FIRED successfully
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/register:
 *   post:
 *     tags: [Company]
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               company_name:
 *                 type: string
 *               country:
 *                 type: string
 *               industry:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success Now Confirm Your Email
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/login:
 *   post:
 *     tags: [Company]
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Login
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/refresh_token:
 *   post:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: gets new access token
 *       400:
 *         description: Bad request
 *
 */

/**
 * @openapi
 * paths:
 *  /company/profile:
 *   get:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: Company Profile retrieved
 *       400:
 *         description: Bad request
 *
 */

/**
 * @openapi
 * paths:
 *  /company/subscription/status:
 *   get:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: get subscription status
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/subscription/plans:
 *   get:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: get subscription plans
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/subscription/free:
 *   post:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: get free subscription
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/subscription/basic:
 *   post:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: get basic subscription
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/subscription/premium:
 *   post:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Company]
 *
 *     responses:
 *       200:
 *         description: get premium subscription
 *       400:
 *         description: Bad request
 *
 */
export default router;
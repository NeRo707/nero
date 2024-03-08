import express from "express";
const router = express.Router();

import verifyEmployeeToken from "../middlewares/authEmployeeMiddleware";
import refreshEmployeeToken from "../middlewares/refreshEmployeeToken";

import {
  authEmployee,
  getEmployeeProfile,
  getFiles,
  logoutEmployee,
  verifyEmployee,
} from "../controllers";


router.post("/login", authEmployee); // v
router.post("/logout", logoutEmployee); // v
router.get("/profile", verifyEmployeeToken, getEmployeeProfile); // v
router.post("/verify", verifyEmployee); // v
router.post("/refresh_token", refreshEmployeeToken); // v
router.get("/workfiles", verifyEmployeeToken, getFiles); // v
// -------------------------------------- OPENAPI ------------------------------------
/**
 * @openapi
 * paths:
 *  /company/employee/login:
 *   post:
 *     tags: [Employee]
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
 *         description: Login successful
 *       400:
 *         description: Bad request
 *
 */
/**
 * @openapi
 * paths:
 *  /company/employee/profile:
 *   get:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Employee]
 *
 *     responses:
 *       200:
 *         description: Profile retrieved
 *       400:
 *         description: Bad request
*
*/
/**
 * @openapi
 * paths:
 *  /company/employee/refresh_token:
 *   post:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Employee]
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
 *  /company/employee/workfiles:
 *   get:
 *     consumes:
 *        - application/x-www-form-urlencoded
 *     tags: [Employee]
 *
 *     responses:
 *       200:
 *         description: Files retrieved
 *       400:
 *         description: Bad request
 *
 */
export default router;

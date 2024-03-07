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
router.post("/verify", verifyEmployee); // v
router.get("/profile", verifyEmployeeToken, getEmployeeProfile); // v
router.post("/refresh_token", refreshEmployeeToken); // v
router.get("/workfiles", verifyEmployeeToken, getFiles); // v

export default router;

import express from "express";
const router = express.Router();

import {
  addEmployee,
  removeEmployee,
  authEmployee,
  logoutEmployee,
  verifyEmployee,
  getEmployeeProfile,
} from "../controllers/authEmployeeController";

import verifyEmployeeToken from "../middlewares/authEmployeeMiddleware";
import refreshEmployeeToken from "../middlewares/refreshEmployeeToken";
import verifyOwnerToken from "../middlewares/authCompanyMiddleware";
import verifySubscription from "../middlewares/verifySubscription";

router.post("/register", verifyOwnerToken, verifySubscription, addEmployee); //v
router.delete("/:id", verifyOwnerToken, removeEmployee); // v
router.post("/login", authEmployee); // v
router.post("/logout", logoutEmployee); // v
router.post("/verify", verifyEmployee); // v
router.get("/profile", verifyEmployeeToken, getEmployeeProfile); // v
router.post('/refresh_token', refreshEmployeeToken); // v

export default router;

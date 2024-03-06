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

router.post("/register", verifyEmployeeToken, addEmployee);
router.delete("/:id", removeEmployee);
router.post("/login", authEmployee);
router.post("/logout", logoutEmployee);
router.get("/verify", verifyEmployee);
router.get("/profile", verifyEmployeeToken, getEmployeeProfile);

export default router;

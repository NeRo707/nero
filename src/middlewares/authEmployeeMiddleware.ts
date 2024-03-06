import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type CustomRequest = Request & { companyId?: number };
const verifyEmployeeToken = (req: any, res: any, next: NextFunction) => {
  // console.log(req.cookies.jwt);
  const employee_token = req.cookies.jwt_employee;

  console.log(req.cookies);

  if (!employee_token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Token not provided | Not owner",
    });
  }

  if (employee_token) {
    try {
      jwt.verify(
        employee_token,
        process.env.JWT_SECRET as any,
        (err: Error | null, decoded: any) => {
          if (err) {
            return res
              .status(401)
              .json({ success: false, error: "Unauthorized - Invalid token" });
          }
          // Attach the decoded data to the request for further processing
          if (decoded.employeeId) {
            req.employeeId = decoded.employeeId;
          }

          // Continue processing the request

          next();
        }
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - Invalid token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Token not provided | not Employee",
    });
  }
};

export default verifyEmployeeToken;

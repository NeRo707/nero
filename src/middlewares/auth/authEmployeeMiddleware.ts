import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type CustomRequest = Request & { employeeId?: number; companyId?: number };
const verifyEmployeeToken = (
  req: CustomRequest,
  res: any,
  next: NextFunction
) => {
  // console.log(req.cookies.jwt);

  const employeeRefreshToken = req.cookies.employee_refreshToken;

  if (!employeeRefreshToken) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized - Log in again" });
  }

  const employeeAccessToken = req.headers.authorization?.split(" ")[1];

  console.log("-------", req.headers.authorization);

  console.log(employeeAccessToken);

  if (!employeeAccessToken) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Token not provided | Not Employee",
    });
  }

  if (employeeAccessToken) {
    try {
      jwt.verify(
        employeeAccessToken,
        process.env.JWT_SECRET as any,
        (err: Error | null, decoded: any) => {
          if (err) {
            console.log(err.message);
            return res
              .status(401)
              .json({
                success: false,
                error:
                  "Unauthorized - Invalid_expired token log in again or refresh token",
              });
          }
          // Attach the decoded data to the request for further processing
          console.log("-------------decoded-----------\n", decoded);
          if (decoded.employeeId && decoded.companyId) {
            req.employeeId = decoded.employeeId;
            req.companyId = decoded.companyId;
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

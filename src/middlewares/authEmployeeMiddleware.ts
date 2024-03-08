import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


type CustomRequest = Request & { employeeId?: number };
const verifyEmployeeToken = (
  req: CustomRequest,
  res: any,
  next: NextFunction
) => {
  // console.log(req.cookies.jwt);
  const employeeAccessToken = req.headers.authorization?.split(" ")[1];

  console.log("-------",req.headers.authorization);

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

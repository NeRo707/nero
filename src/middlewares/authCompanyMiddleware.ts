import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type CustomRequest = Request & { companyId?: number };
const verifyOwnerToken = (req: any, res: any, next: NextFunction) => {
  // console.log(req.cookies.jwt);
  const owner_token = req.cookies.jwt_owner;

  console.log(req.cookies);

  if (!owner_token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Token not provided | Not owner",
    });
  }

  if (owner_token) {
    try {
      jwt.verify(
        owner_token,
        process.env.JWT_SECRET as any,
        (err: Error | null, decoded: any) => {
          if (err) {
            return res.status(401).json({
              success: false,
              error: "Unauthorized - Invalid token for owner",
            });
          }
          // Attach the decoded data to the request for further processing

          if (decoded.companyId) {
            req.companyId = decoded.companyId;
          }

          // Continue processing the request
          next();
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Token not provided | not owner",
    });
  }
};

export default verifyOwnerToken;

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: any, res: any, next: NextFunction) => {
  // console.log(req.cookies.jwt);
  const token = req.cookies.jwt; // Assuming the token is stored in a cookie

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized - Token not provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as any,
    (err: Error | null, decoded: any) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized - Invalid token" });
      }
      // Attach the decoded data to the request for further processing
      req.companyId = decoded.companyId;
      // console.log(decoded);
      // console.log(req.companyId);
      


      // Continue processing the request
      next();
    }
  );
};

export default verifyToken;

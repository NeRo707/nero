import crypto from "crypto";

export const generateEmailConfirmationToken = (): string => {
  const token = crypto.randomBytes(20).toString("hex");
  return token;
};

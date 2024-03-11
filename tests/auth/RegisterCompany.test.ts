import { registerCompany } from "../../src/controllers";
import { Request, Response } from "express";
import { Company } from "../../src/models/company";

jest.mock("bcrypt", () => ({
  hash: jest.fn(() => Promise.resolve("hashedPassword")),
}));

jest.mock("../../../models/company", () => ({
  Company: {
    create: jest.fn(),
  },
}));

jest.mock("../../src/config/nodemailerConfig", () => ({
  sendMail: jest.fn(),
}));

jest.mock("../../src/utils/genEmailToken", () => ({
  generateEmailConfirmationToken: jest.fn(() => "emailToken"),
}));

describe("registerCompany", () => {
  it("should register a company successfully", async () => {
    const mockReq = {
      body: {
        company_name: "Test Company",
        email: "test@test.com",
        password: "password",
        country: "Test Country",
        industry: "Test Industry",
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    Company.create = jest.fn().mockResolvedValue({
      email: "test@test.com",
      company_name: "Test Company",
    });

    await registerCompany(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: {
        email: "test@test.com",
        company_name: "Test Company",
      },
    });
  });
});

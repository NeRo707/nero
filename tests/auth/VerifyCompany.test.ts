import { Request, Response } from "express";
import { verifyCompany } from "../../src/controllers";
import { Company } from "../../src/models/company";

jest.mock("../../../models/company", () => ({
  Company: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
}));

describe("verifyCompany", () => {
  it("should verify a company successfully", async () => {
    const mockReq = {
      query: {
        token: "validToken",
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    Company.findOne = jest.fn().mockResolvedValue({
      update: jest.fn(),
    });

    await verifyCompany(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: "Email verified",
    });
  });

  it("should return an error for an invalid token", async () => {
    const mockReq = {
      query: {
        token: "invalidToken",
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    Company.findOne = jest.fn().mockResolvedValue(null);

    await verifyCompany(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid token",
    });
  });
});

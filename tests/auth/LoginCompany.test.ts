import { Request, Response } from "express";
import { loginCompany } from "../../src/controllers/ownerControllers/auth/loginCompany";
import { Company } from "../../src/models/company";
import bcrypt from "bcrypt";
import { generateCompanyToken } from "../../src/utils/generateToken";

jest.mock("../../src/models/company", () => ({
  Company: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("../../src/utils/generateToken", () => ({
  generateCompanyToken: jest.fn(),
}));

jest.mock("../../src/controllers", () => ({
  loginCompany: jest.fn(),
  logoutCompany: jest.fn(),
}));

describe("LoginCompany", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email or password is missing", async () => {
    req.body = { email: "test@example.com" };
    await loginCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Missing required fields",
    });
  });

  it("should return 401 if company not found", async () => {
    (Company.findOne as jest.Mock).mockResolvedValueOnce(null);
    await loginCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid credentials",
    });
  });

  it("should return 401 if company is not verified", async () => {
    const company = { verified: false };
    (Company.findOne as jest.Mock).mockResolvedValueOnce(company);
    await loginCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Please verify your email first",
    });
  });

  it("should return 401 if password is incorrect", async () => {
    const company = { dataValues: { password: "hashedPassword" } };
    (Company.findOne as jest.Mock).mockResolvedValueOnce(company);
    await loginCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Invalid credentials",
    });
  });

  it("should return 200 and set cookies if login is successful", async () => {
    const company = { dataValues: { id: 1, password: "hashedPassword" } };
    (Company.findOne as jest.Mock).mockResolvedValueOnce(company);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (generateCompanyToken as jest.Mock).mockResolvedValueOnce({
      owner_accessToken: "accessToken",
      owner_refreshToken: "refreshToken",
    });
    await loginCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      owner_accessToken: "accessToken",
      message: "Login successful",
      data: company,
    });
    expect(res.cookie).toHaveBeenCalledWith(
      "owner_refreshToken",
      "refreshToken",
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
    );
  });

  it("should return 500 if an error occurs", async () => {
    const error = new Error("Server Error");
    (Company.findOne as jest.Mock).mockRejectedValueOnce(error);
    await loginCompany(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Server Error",
    });
  });

  it("should return 400 if no fields are provided", async () => {
    req.body = {};

    await loginCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

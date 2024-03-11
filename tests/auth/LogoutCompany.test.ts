import { logoutCompany } from "../../src/controllers";
import { Request, Response } from 'express';

describe('logoutCompany', () => {
  it('should log out a company successfully', () => {
    const mockReq = {} as unknown as Request;

    const mockRes = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    logoutCompany(mockReq, mockRes);

    expect(mockRes.cookie).toHaveBeenCalledWith('owner_refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Company Logged Out' });
  });

  // Add more test cases as needed
});

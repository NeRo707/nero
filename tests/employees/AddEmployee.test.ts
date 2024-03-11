import { addEmployee } from "../../src/controllers";
import { Request, Response } from 'express';
import { Employee, Subscription, Billing } from "../../src/models/company";


jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => 'randomHash'),
  })),
}));

jest.mock('../../../models/company', () => ({
  Employee: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Subscription: {
    findOne: jest.fn(),
  },
  Billing: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/config/nodemailerConfig', () => ({
  sendMail: jest.fn(),
}));

jest.mock('../../src/utils/genEmailToken', () => ({
  generateEmailConfirmationToken: jest.fn(() => 'emailToken'),
}));

describe('addEmployee', () => {
  it('should add an employee successfully', async () => {
    const mockReq = {
      companyId: 1,
      body: {
        email: 'test@test.com',
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    Employee.findOne = jest.fn().mockResolvedValue(null);
    Employee.create = jest.fn().mockResolvedValue({
      email: 'test@test.com',
    });
    Subscription.findOne = jest.fn().mockResolvedValue({
      plan_name: 'basic',
      price_per_user: 5,
      fixed_price: 10,
    });
    Billing.findOne = jest.fn().mockResolvedValue({
      update: jest.fn(),
    });

    await addEmployee(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Employee added successfully' });
  });


});

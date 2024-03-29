//---------------------------

import { addEmployee } from "./ownerControllers/employees/addEmployee";
import { getSubscription } from "./ownerControllers/subscriptions/getSubscription";
import { getSubscriptionPlans } from "./ownerControllers/subscriptions/getSubscriptionPlans";
import { getSubscriptionStatus } from "./ownerControllers/subscriptions/getSubscriptionStatus";
import { loginCompany } from "./ownerControllers/auth/loginCompany";
import { logoutCompany } from "./ownerControllers/auth/logoutCompany";
import { registerCompany } from "./ownerControllers/auth/registerCompany";
import { removeEmployee } from "./ownerControllers/employees/removeEmployee";
import { updateCompanyProfile } from "./ownerControllers/profile/updateCompanyProfile";
import { verifyCompany } from "./ownerControllers/auth/verifyCompany";
import { getCompanyProfile } from "./ownerControllers/profile/getCompanyProfile";

//----------------------------

import { authEmployee } from "./employeeControllers/auth/authEmployee";
import { getEmployeeProfile } from "./employeeControllers/profile/getEmployeeProfile";
import { logoutEmployee } from "./employeeControllers/auth/logoutEmployee";
import { verifyEmployee } from "./employeeControllers/auth/verifyEmployee";

//---------------------------

import { uploadCompanyFile } from "./ownerControllers/files/uploadCompanyFile";
import { editUploadedFile } from "./ownerControllers/files/editUploadedFile";
import { getCompanyFile } from "./ownerControllers/files/getCompanyFile";
import { deleteUploadedFile } from "./ownerControllers/files/deleteUploadedFile";

//---------------------------

import { getEmployeeFiles } from "./employeeControllers/files/getEmployeeFiles";
import { uploadEmployeeFile } from "./employeeControllers/files/uploadEmployeeFile";
import { editEmployeeFile } from "./employeeControllers/files/editEmployeeFile";

//---------------------------

export {
  getCompanyProfile,
  addEmployee,
  getSubscription,
  getSubscriptionPlans,
  getSubscriptionStatus,
  loginCompany,
  logoutCompany,
  registerCompany,
  removeEmployee,
  updateCompanyProfile,
  verifyCompany,
  authEmployee,
  getEmployeeProfile,
  logoutEmployee,
  verifyEmployee,
  uploadCompanyFile,
  editUploadedFile,
  getCompanyFile,
  deleteUploadedFile,
  getEmployeeFiles,
  uploadEmployeeFile,
  editEmployeeFile,
};

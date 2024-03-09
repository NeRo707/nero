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
import { verifyEmail } from "./ownerControllers/auth/verifyEmail";
import { getCompanyProfile } from "./ownerControllers/profile/getCompanyProfile";

//----------------------------

import { authEmployee } from "./employeeControllers/auth/authEmployee";
import { getEmployeeProfile } from "./employeeControllers/profile/getEmployeeProfile";
import { getFiles } from "./employeeControllers/files/getFiles";
import { logoutEmployee } from "./employeeControllers/auth/logoutEmployee";
import { verifyEmployee } from "./employeeControllers/auth/verifyEmployee";

//---------------------------

import { uploadCompanyFile } from "./ownerControllers/files/uploadCompanyFile";
import { editUploadedFile } from "./ownerControllers/files/editUploadedFile";
import { getCompanyFile } from "./ownerControllers/files/getCompanyFile";
import { deleteUploadedFile } from "./ownerControllers/files/deleteUploadedFile";

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
  verifyEmail,
  authEmployee,
  getEmployeeProfile,
  getFiles,
  logoutEmployee,
  verifyEmployee,
  uploadCompanyFile,
  editUploadedFile,
  getCompanyFile,
  deleteUploadedFile,
};

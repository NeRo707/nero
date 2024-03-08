//---------------------------

import { addEmployee } from "./ownerControllers/addEmployee";
import { getSubscription } from "./ownerControllers/getSubscription";
import { getSubscriptionPlans } from "./ownerControllers/getSubscriptionPlans";
import { getSubscriptionStatus } from "./ownerControllers/getSubscriptionStatus";
import { loginCompany } from "./ownerControllers/loginCompany";
import { logoutCompany } from "./ownerControllers/logoutCompany";
import { registerCompany } from "./ownerControllers/registerCompany";
import { removeEmployee } from "./ownerControllers/removeEmployee";
import { updateCompanyProfile } from "./ownerControllers/updateCompanyProfile";
import { verifyEmail } from "./ownerControllers/verifyEmail";
import { getCompanyProfile } from "./ownerControllers/getCompanyProfile";

//----------------------------

import { authEmployee } from "./employeeControllers/authEmployee";
import { getEmployeeProfile } from "./employeeControllers/getEmployeeProfile";
import { getFiles } from "./employeeControllers/getFiles";
import { logoutEmployee } from "./employeeControllers/logoutEmployee";
import { verifyEmployee } from "./employeeControllers/verifyEmployee";

//---------------------------

import { uploadCompanyFile } from "./ownerControllers/uploadCompanyFile";
import { editUploadedFile } from "./ownerControllers/editUploadedFile";
import { getCompanyFile } from "./ownerControllers/getCompanyFile";

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
};

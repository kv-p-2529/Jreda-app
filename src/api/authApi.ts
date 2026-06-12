// Central registry of backend endpoints. Keep paths here (not scattered across
// screens) so a route change is a one-line edit. Each value is either a static
// path or a builder fn for path/query params.
//
// The object is returned with its inferred type (no `Record<string, any>`
// annotation), so destructuring `authApi()` gives autocomplete on every

import { getFullUrl } from "@/services/baseService";

// endpoint name and the right call signature for the builder fns.
export default function authApi() {
  return {
    // Dropdown APIs
    masterListApi: '/app/master/filter-options', // GET
    talukasListApi: (id: string | number) =>
      `/app/master/location/talukas?district_code=${id}`, // GET
    townsListApi: (id: string | number) =>
      `/app/master/location/towns?taluka_code=${id}`, // GET
    blocksListApi: (id: string | number) =>
      `/app/master/location/blocks?district_code=${id}`, // GET

    // Registration APIs
    aadhaarGetOtpApi: getFullUrl('/app/aadhaar/initiate'), // POST
    aadhaarVerifyOtpApi: getFullUrl('/app/aadhaar/verify-otp'), // POST
    registerStartApi: getFullUrl('/app/registration/start'), // POST
    registerResumeApi: (token: string) => getFullUrl(`/app/registration/${token}`), // GET
    registerSectionUpdateApi: (token: string, section: string | number) =>
      getFullUrl(`/app/registration/${token}/section/${section}`), // PUT
    registerPreviewApi: (token: string) => getFullUrl(`/app/registration/${token}/preview`), // GET

    // Login APIs
    getLoginOtpApi: getFullUrl('/app/auth/request-otp'), // POST
    verifyLoginOtpApi: getFullUrl('/app/auth/verify-otp'), // POST
  };
}

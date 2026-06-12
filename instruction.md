**Syntax to write api integeration logic**
const onLogin = (values: LoginValues) => {
     setLoader('login');

     const body = {
      saral_no: saralNo,
      otp: values.otp
     };

     apiClient
       .post(verifyLoginOtpApi, body)
       .then(() => {
         showToast('Login successfully');
       })
       .catch(err => throwError(err))
       .finally(() => setLoader(''));
  };
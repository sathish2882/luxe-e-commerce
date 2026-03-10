import API from "./axiosInstance";

export const loginApi = (data:FormData) =>{
    return API.post("/login",data)
}
export const signupApi = (data:FormData) =>{
    return API.post("/signup",data)
}

export const userInfoApi = () =>{
    return API.post("/getuserinfo")
}

export const forgotPasswordApi = (data:FormData) =>{
    return API.post("/forgot_password",data)
}
export const verifyOtpApi = (data:FormData) =>{
    return API.post("/verify_forgot_otp",data)
}
export const resetPasswordApi = (data:FormData) =>{
    return API.post("/set_new_password",data)
}
export const resendOtpApi = (data:FormData) =>{
    return API.post("/resend_otp",data)
}
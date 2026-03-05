import API from "./axiosInstance";

export const loginApi = (data:FormData) =>{
    return API.post("/login",data)
}
export const signupApi = (data:FormData) =>{
    return API.post("/signup",data)
}

export const userInfoApi = () =>{
    return API.get("/getuserinfo")
}

export const forgotPasswordApi = (data:FormData) =>{
    return API.post("/auth/forgot-password",data)
}
export const verifyOtpApi = (data:FormData) =>{
    return API.post("/auth/verify-otp",data)
}
export const resetPasswordApi = (data:FormData) =>{
    return API.post("/auth/reset-password",data)
}
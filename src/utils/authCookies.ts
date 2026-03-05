import Cookies from "js-cookie"

export const setToken = (token: string)=>{
    Cookies.set("token",token,{expires:7})
}
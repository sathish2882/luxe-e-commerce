import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 7 });
};

export const setUser = (userType: string) => {
  Cookies.set("userType", userType, { expires: 7 });
};

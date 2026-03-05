//import { Navigate } from "react-router-dom";
//import Cookies from "js-cookie"


const ProtectedRoute = ({children}:any)=>{
   //const token = Cookies.get("toekn")

//    if(token){
//       return <Navigate to="/login" replace />
//    }

   return children
}

export default ProtectedRoute
import { toast } from "react-toastify";

const NotifyIHttpResponse = (response:{success: boolean, message: string})=>{
    if(response.success){
        toast.success(response.message || "Operation successful!");
    }
    else{
        toast.error(response.message || "Operation failed!");
    }
}

export default NotifyIHttpResponse;
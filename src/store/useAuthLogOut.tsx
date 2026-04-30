import { useNavigate } from "react-router-dom";
import useAuthStore from "./useAuthStore";

export const useAuthLogOut = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () =>{
        if (window.confirm("로그아웃 하시겠습니까?")){
            logout();
            navigate('/Login', { replace: true});
        }
    };

    return handleLogout
};
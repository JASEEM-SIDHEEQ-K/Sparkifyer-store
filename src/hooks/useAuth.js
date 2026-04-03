import { useSelector } from "react-redux";


const useAuth = () => {

    const { user,token,role,isLoading,error}=useSelector(state=>state.auth)

  return {
    user,
    token,
    role,
    isLoading,
    error,
    isAuthenticated: !!token,
    isAdmin: role === 'admin',
  }
}

export default useAuth

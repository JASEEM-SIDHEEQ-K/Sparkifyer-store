import { toast } from 'react-toastify'
import api from '../../services/api'


export const registerUser = async (userData)=>{
    try{
        const checkEmail = await api.get(`/users?email=${userData.email}`)

        if(checkEmail.data.length>0){
            throw new Error('Email already registered!')
        }

        const response= await api.post("/users",{
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'user',
            isActive: true,
        })

        toast('registration successfull')
        return response.data

    }catch(error){
        throw error.message || "Registration failed!";
    }
}




export const loginUser = async (credentials)=>{
    try{

        const response = await api.get("/users");

        const user = response.data.find(
        (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        if (!user) {
        throw new Error("Invalid email or password!");
        }

        if (user.isActive === false) {
        throw new Error(
            "Your account has been deactivated. Please contact support."
        );
        }

        const sessionData ={
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token: `token_${user.id}_${Date.now()}`,
            role: user.role,
        }
        toast('login successfull')
        return sessionData
        
    }

    catch(error){
        throw error.message || "Login failed!";
    }
}
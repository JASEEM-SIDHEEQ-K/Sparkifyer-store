import { toast } from 'react-toastify'
import api from '../../services/api'


export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    toast('registration successfull')
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registration failed!"
    );
  }
};




export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { user, token } = response.data;

    toast('login successfull')
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
      role: user.role,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Login failed!"
    );
  }
};
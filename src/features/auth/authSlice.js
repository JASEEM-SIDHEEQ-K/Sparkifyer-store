import { createSlice } from "@reduxjs/toolkit";
import { getSession,saveSession,clearSession } from "../../utils/localStorage";


//LocalStorage-key
const session = getSession();

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:session?.user || null,
        token:session?.token || null,
        role:session?.role || null,
        isAuthenticated: !!session,
        isLoading: false,
        error: null,
    },
    reducers:{
        loginStart:(state)=>{
            state.isLoading = true;
            state.error = null;
        },
        
        loginSuccess:(state,action)=>{
            const {user,token,role}=action.payload;
            state.user = user
            state.token = token
            state.role = role
            state.isAuthenticated = true
            state.isLoading = false
            state.error = null

            saveSession({user,token,role})
        },

        loginFail:(state,action)=>{
            state.isLoading = false
            state.error = action.payload
        },

        logout:(state)=>{
            state.user = null
            state.token = null
            state.role = null
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null

            clearSession()
        },

        clearError:(state)=>{
            state.error=null
        },
    }
})


export const {loginStart,loginSuccess,loginFail,logout,clearError} = authSlice.actions


//These are functions to get data from Redux store(selector)

export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer
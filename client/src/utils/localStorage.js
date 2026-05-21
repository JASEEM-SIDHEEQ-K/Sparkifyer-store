export const saveSession = (userData)=>{
    localStorage.setItem("session",JSON.stringify(userData))
}

export const getSession = () =>{
    const session=localStorage.getItem("session")
    return session? JSON.parse(session):null
}


export const clearSession = () =>{
    localStorage.removeItem("session")
}


export const clearAll = () =>{
    localStorage.removeItem("session")
}
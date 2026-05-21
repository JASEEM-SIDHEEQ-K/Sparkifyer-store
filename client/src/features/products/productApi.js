import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";


export const fetchAllProducts= async ()=>{
    const response = await api.get('/products')
    return response.data
}

export const fetchProductById = async(id) =>{
    const response = await api.get(`/products/${id}`)
    return response.data
}



export const useGetProducts = () =>{
    return useQuery({
        queryKey:['products'],
        queryFn:fetchAllProducts,
        staleTime:1000 * 60 * 5,        //5 min
        retry:2                         // retry twice on failure
    })
}


export const useGetProductById = (id) =>{
    return useQuery({
        queryKey:['product',id],
        queryFn:()=>fetchProductById(id),
        enabled: !!id,               // only fetch if id exists
        staleTime:1000 * 60 * 5,
        retry:2
    })
}
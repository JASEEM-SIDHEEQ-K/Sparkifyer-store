import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { setProducts } from "./productSlice";


export const fetchAllProducts= async ()=>{
    const response = await api.get('/products')
    // backend returns { products: [...] }
    return response.data.products;
}

export const fetchProductById = async(id) =>{
    const response = await api.get(`/products/${id}`)
    // backend returns { product: {...} }
    return response.data.product;
}



export const useGetProducts = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await fetchAllProducts();
      dispatch(setProducts(data));
      return data;
    },
    staleTime: 1000 * 60 * 5,       //5 min
    retry: 2,                       // retry twice on failure
  });
};


// ─── TanStack Query → Single Product ─────────────────────────
export const useGetProductById = (id) => {
  const productId = id ? String(id) : null;

  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    staleTime: 0,
    retry: 1,
  });
};

import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:'products',
    initialState:{
        items:[],                     // all products from API
        searchQuery: "",              // search input value
        selectedCategory: "All",      // active category filter
        sortBy: "default",            // sort option
    },
    reducers:{

        setProducts:(state,action)=>{
            state.items=action.payload
        },

        setSearchQuery:(state,action)=>{
            state.searchQuery=action.payload
        },

        setSelectedCategory:(state,action)=>{
            state.selectedCategory=action.payload
        },

        setSortBy:(state,action)=>{
            state.sortBy=action.payload
        },

        resetFilters:(state)=>{
            state.searchQuery = "";
            state.selectedCategory = "All";
            state.sortBy = "default";
        }

    }
})


export const {setProducts,setSearchQuery,setSelectedCategory,setSortBy,resetFilters} = productSlice.actions



export const selectAllProducts= (state)=>state.Products?.items ?? []
export const selectSearchQuery= (state)=>state.products?.searchQuery ?? "";
export const selectSelectedCategory= (state)=>state.products?.selectedCategory ?? "All"
export const selectSortBy= (state)=>state.products?.sortBy ?? "default"



//Filtering

export const selectFilteredProducts = (state) => {
  // ✅ safe fallback if state.products is undefined
  if (!state.products) return [];

  const items = state.products.items ?? [];
  const selectedCategory = state.products.selectedCategory ?? "All";
  const searchQuery = state.products.searchQuery ?? "";
  const sortBy = state.products.sortBy ?? "default";

  let filtered = [...items];

  if (selectedCategory !== "All") {
    filtered = filtered.filter(
      (p) => p.category === selectedCategory
    );
  }

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  switch (sortBy) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return filtered;
};

export const selectCategories = (state) => {
  if (!state.products) return ["All"];
  const categories = state.products.items?.map((p) => p.category) ?? [];
  return ["All", ...new Set(categories)];
};

export default productSlice.reducer;
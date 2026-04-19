import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:'products',
    initialState:{
        items:[],                     // all products from API
        searchQuery: "",              // search input value
        selectedCategory: "All",      // active category filter
        sortBy: "default",            // sort option
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 6,
    },
    reducers:{

        setProducts:(state,action)=>{
            state.items=action.payload
        },

        setSearchQuery:(state,action)=>{
            state.searchQuery=action.payload
            state.currentPage = 1;    // reset page on search
        },

        setSelectedCategory:(state,action)=>{
            state.selectedCategory=action.payload
            state.currentPage = 1;
        },

        setSortBy:(state,action)=>{
            state.sortBy=action.payload
            state.currentPage = 1;
        },

        resetFilters:(state)=>{
            state.searchQuery = "";
            state.selectedCategory = "All";
            state.sortBy = "default";
            state.currentPage = 1;
        },

        setCurrentPage:(state,action)=>{
          state.currentPage=action.payload
        },

        setTotalItems: (state, action) => {
          state.totalItems = action.payload;
        },



    }
})


export const {
  setProducts,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setCurrentPage,
  setTotalItems,
  resetFilters,
} = productSlice.actions;



export const selectAllProducts= (state)=>state.products?.items ?? []
export const selectSearchQuery= (state)=>state.products?.searchQuery ?? "";
export const selectSelectedCategory= (state)=>state.products?.selectedCategory ?? "All"
export const selectSortBy= (state)=>state.products?.sortBy ?? "default"
export const selectCurrentPage = (state) =>state.products?.currentPage ?? 1;
export const selectTotalItems = (state) =>state.products?.totalItems ?? 0;
export const selectItemsPerPage = (state) =>state.products?.itemsPerPage ?? 6;


//Filtering

// ✅ selectFilteredProducts — add isActive filter
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSelectedCategory, selectSearchQuery, selectSortBy],
  (items, selectedCategory, searchQuery, sortBy) => {

    // ✅ filter out inactive products on user side
    let filtered = [...items].filter((p) => p.isActive !== false);

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
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
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }
);


// ─── Filtered count ───────────────────────────────────────────
export const selectFilteredCount = createSelector(
  [selectFilteredProducts],
  (filtered) => filtered.length
);


export const selectTotalPages = createSelector(
  [selectFilteredCount, selectItemsPerPage],
  (filteredCount, itemsPerPage) => {
    if (filteredCount === 0) return 0;
    const pages = Math.ceil(filteredCount / itemsPerPage); //calculate total page need
    return pages;
  }
);

// paginate from filteredProducts
export const selectPaginatedProducts = createSelector(
  [selectFilteredProducts, selectCurrentPage, selectItemsPerPage],
  (filteredProducts, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }
);






export const selectCategories = createSelector(
  [selectAllProducts],
  (items) => {
    const categories = items
      .filter((p) => p.isActive !== false)
      .map((p) => p.category);
    return ["All", ...new Set(categories)];
  }
);

export default productSlice.reducer;
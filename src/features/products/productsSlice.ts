import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'none' | 'price-low' | 'price-high' | 'rating';
  priceRange: number;
  maxPrice: number;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  total: 0,
  status: 'idle',
  detailsStatus: 'idle',
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'none',
  priceRange: 10000,
  maxPrice: 10000,
  currentPage: 1,
  itemsPerPage: 8,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await api.get('/products?limit=0');
  return response.data;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id: string | number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<ProductsState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<number>) => {
      state.priceRange = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailsStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.total = action.payload.total;
        
        const prices = action.payload.products.map((p: Product) => p.price);
        const max = Math.max(...prices, 0);
        state.maxPrice = max;
        state.priceRange = max;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailsStatus = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch product details';
      });
  },
});

export const { 
  setSearchQuery, 
  setSelectedCategory, 
  setSortBy, 
  setPriceRange,
  setCurrentPage, 
  clearSelectedProduct 
} = productsSlice.actions;
export default productsSlice.reducer;

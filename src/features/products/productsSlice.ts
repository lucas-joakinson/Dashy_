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
  categories: string[];
  selectedProduct: Product | null;
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  selectedProduct: null,
  total: 0,
  status: 'idle',
  detailsStatus: 'idle',
  error: null,
  searchQuery: '',
  selectedCategory: 'All',
  currentPage: 1,
  itemsPerPage: 8,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (category?: string) => {
  const url = category && category !== 'All' 
    ? `/products/category/${category}?limit=0` 
    : '/products?limit=0';
  const response = await api.get(url);
  return response.data;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id: string | number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await api.get('/products/categories');
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
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const categories = Array.isArray(action.payload) 
          ? action.payload.map(cat => {
              if (typeof cat === 'string') return cat;
              return cat.slug || cat.name || String(cat);
            })
          : [];
        state.categories = ['All', ...categories];
      });
  },
});

export const { setSearchQuery, setSelectedCategory, setCurrentPage, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;

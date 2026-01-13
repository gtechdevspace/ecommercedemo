import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchProducts = createAsyncThunk('products/fetch', async (params: { page?: number; perPage?: number; q?: string } = {}) => {
  const res = await api.get('/api/products', { params });
  return res.data as { items: any[]; total: number };
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [] as any[], status: 'idle' as string, total: 0 as number },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.items = action.payload.items; state.total = action.payload.total; state.status = 'succeeded'; })
      .addCase(fetchProducts.rejected, (state) => { state.status = 'failed'; });
  }
});

export default productSlice.reducer;

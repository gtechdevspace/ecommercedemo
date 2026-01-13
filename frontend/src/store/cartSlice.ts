import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await api.get('/api/cart');
  return res.data as { items: any[] };
});

export const addItem = createAsyncThunk('cart/addItem', async ({ productId, quantity }: { productId: string; quantity: number }) => {
  const res = await api.post('/api/cart/items', { productId, quantity });
  return res.data;
});

export const updateItem = createAsyncThunk('cart/update', async ({ productId, quantity }: { productId: string; quantity: number }) => {
  const res = await api.patch(`/api/cart/items/${productId}`, { quantity });
  return res.data;
});

export const removeItem = createAsyncThunk('cart/remove', async ({ productId }: { productId: string }) => {
  const res = await api.delete(`/api/cart/items/${productId}`);
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as any[], status: 'idle' as string },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload.items; state.status = 'succeeded'; })
      .addCase(fetchCart.rejected, (state) => { state.status = 'failed'; })

      .addCase(addItem.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(updateItem.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(removeItem.fulfilled, (state, action) => { state.items = action.payload.items; });
  }
});

export default cartSlice.reducer;
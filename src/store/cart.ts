import { create } from "zustand";
import { api } from "@/lib/api";
import type { Cart } from "@/lib/types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: () => number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantidade: number) => Promise<void>;
  updateItem: (cartItemId: number, quantidade: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isLoading: false,
  itemCount() {
    return get().cart?.items.reduce((sum, item) => sum + item.quantidade, 0) ?? 0;
  },
  async fetchCart() {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/cart");
      set({ cart: data.data });
    } finally {
      set({ isLoading: false });
    }
  },
  async addItem(productId, quantidade) {
    const { data } = await api.post("/cart/add", { product_id: productId, quantidade });
    set({ cart: data.data });
  },
  async updateItem(cartItemId, quantidade) {
    const { data } = await api.put("/cart/update-item", { cart_item_id: cartItemId, quantidade });
    set({ cart: data.data });
  },
  async removeItem(cartItemId) {
    const { data } = await api.delete(`/cart/remove-item/${cartItemId}`);
    set({ cart: data.data });
  },
  async clear() {
    const { data } = await api.delete("/cart/clear");
    set({ cart: data.data });
  },
  reset() {
    set({ cart: null });
  },
}));

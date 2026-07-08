import { create } from "zustand";

interface CartToastState {
  visible: boolean;
  productName: string;
  quantidade: number;
  show: (productName: string, quantidade: number) => void;
  hide: () => void;
}

export const useCartToastStore = create<CartToastState>((set) => ({
  visible: false,
  productName: "",
  quantidade: 0,
  show: (productName, quantidade) => set({ visible: true, productName, quantidade }),
  hide: () => set({ visible: false }),
}));

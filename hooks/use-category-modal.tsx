import { AddCity, Category } from "@/types/types";
import { create } from "zustand";

interface ModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  cart: AddCity[];
  addCity: (item: AddCity) => void;
  categories: Category[];
  addCategories: (item: Category) => void;
}

export const useCategoryModal = create<ModalStore>((set) => ({
  cart: [],
  isOpen: false,

  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  addCity: (item) =>
    set((state) => {
      const existingCity = state.cart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingCity) {
        return { cart: state.cart };
      } else {
        return { cart: [item] };
      }
    }),
  categories: [],
  addCategories: (item) =>
    set(() => {
      return { categories: [item] };
    }),
}));

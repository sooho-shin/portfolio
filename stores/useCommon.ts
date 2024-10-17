import { create } from "zustand";
// Type definitions for the store
type CommonStoreType = {
  route: string;
  setRoute: (route: string) => void;
};

const useCommonStore = create<CommonStoreType>((set, get) => ({
  route: "/",
  setRoute: (route: string) => {
    set({ route: route });
  },
}));

export { useCommonStore };

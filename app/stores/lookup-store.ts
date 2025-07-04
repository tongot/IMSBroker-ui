import { create } from "zustand";
import ILookup from "../utils/interfaces/lookups/lookup";
import { GET } from "../utils/http/GET";
import { InsuranceMainType } from "../api/ims-client";

type InsuranceMainTypeStore = {
  loadingInsType: boolean;
  insuranceTypes: InsuranceMainType[];
  getInsTypes: () => Promise<void>;
};

type lookupStore = {
  loadingLookup: boolean;
  lookupData: ILookup[];
  lookupCategories: string[];
  getLookupFor: (type: string) => Promise<void>;
  getLookUp: (type: string) => ILookup[]; 
  getLookupCategories: () => Promise<void>;
};

export const useInsTypeStore = create<InsuranceMainTypeStore>((set) => ({
  loadingInsType: false,

  insuranceTypes: [],
  getInsTypes: async () => {
    set({ loadingInsType: true });
    const res = await GET<InsuranceMainType[]>("/lookup/ins-types");
    set({ loadingInsType: false });
    set({ insuranceTypes: res });
  },
}));

export const useLookupStore = create<lookupStore>((set, get) => ({
  loadingLookup: false,
  lookupData: [],
  lookupCategories: [],

  getLookupFor: async (lookupType) => {
    set({ loadingLookup: true });
    const res = await GET<ILookup[]>(`/lookup/${lookupType}`);
    set({ loadingLookup: false });
    set({ lookupData: res });
  },

  getLookUp: (type: string) => {
    if (!get().lookupData) return [];
    return get().lookupData.filter((x) => x.lookupType === type);
  },

  getLookupCategories: async () => {
    set({ loadingLookup: true });
    const res = await GET<string[]>(`/lookup/categories-names`);
    set({ loadingLookup: false });
    set({ lookupCategories: res });
  },
}));

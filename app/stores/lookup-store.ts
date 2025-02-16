import { create } from "zustand";
import IInsuranceMainType from "../interfaces/lookups/insurance-main-types";
import { GET } from "../http/GET";

type InsuranceMainTypeStore = {
  loadingInsType:boolean;
  insuranceTypes:IInsuranceMainType[];
  getInsTypes:() => Promise<void>;
};

export const useInsTypeStore = create<InsuranceMainTypeStore>((set) => ({
  loadingInsType: false,

  insuranceTypes: [],
  getInsTypes: async () =>{

    set({loadingInsType: true})
    const res = await GET<IInsuranceMainType[]>('/lookup/ins-types')
    debugger
    set({loadingInsType: false})
    set({insuranceTypes: res})
  }
}));

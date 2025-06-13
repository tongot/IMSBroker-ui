// src/queries/addons.ts
import { useQuery } from "@tanstack/react-query";
import { GET } from "../http/GET";
import IDefaultAddOn from "../interfaces/cover-structure/add-on";
import { IGetCoverStructureAddOnDto } from "@/app/api/ims-client";


export const useAddonsQuery = () => {
  return useQuery({
    queryKey: ["addons"],
    queryFn: () => GET<IDefaultAddOn[]>("/addons"),
  });
};

export const useCoverAddonsQuery = (id: number) => {
  return useQuery({
    queryKey: ["cover-add-ons"+id],
    queryFn: () => GET<IGetCoverStructureAddOnDto[]>("/coverStructure/cover-addons/"+id),
  });
};


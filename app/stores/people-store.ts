import { create } from "zustand";
import POST from "../utils/http/POST";
import {IGetPersonDto, SearchPeopleQuery } from "../api/ims-client";

type PeopleStore = {
  loadingPeople: boolean;
  selectedPeople: IGetPersonDto[];
  peopleList: IGetPersonDto[];
  searchPeople: (searchString: string) => Promise<void>;
  selectOrRemovePeople: (people: IGetPersonDto) => void;
  clearPeopleList: () => void;
  presetSelectedPeople: (people: IGetPersonDto[]) => void;
};

export const usePeopleStore = create<PeopleStore>((set, get) => ({
  loadingPeople: false,
  selectedPeople: [],
  peopleList: [],

  searchPeople: async (searchString: string) => {
    
    set({ loadingPeople: true, peopleList: []});

    const res: IGetPersonDto[] = await POST(new SearchPeopleQuery({searchTerm: searchString}), "/people/search");
    set({ loadingPeople: false });
    get().peopleList = res.map((x) => {
      return { ...x, isSelected: get().selectedPeople.find((y) => y.id === x.id) ? true : false };});
  },

  selectOrRemovePeople: (people: IGetPersonDto) => {

    const peopleIndex = get().selectedPeople.findIndex((x) => x.id === people.id);
    if (peopleIndex === -1) {
      set({ 
        selectedPeople: [...get().selectedPeople, people], 
        peopleList: [...get().peopleList.map(x => { return {...x, isSelected: (people.id === x.id ? true : x.isSelected)}})]
      });
    } else {
      set({
        selectedPeople: get().selectedPeople.filter((x) => x.id !== people.id),
        peopleList: [...get().peopleList.map(x => { return {...x, isSelected: (people.id === x.id ? false : x.isSelected)}})]
      });
    }
  },

  clearPeopleList:() =>{
    set({peopleList:[]})
  },

  presetSelectedPeople: (peoples: IGetPersonDto[]) => {
    set({selectedPeople: peoples})
  },

}));
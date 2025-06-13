import { create } from "zustand";
import POST from "../utils/http/POST";
import IUser from "../utils/interfaces/users/user";

type UserStore = {
  loadingUser: boolean;
  selectedUsers: IUser[];
  userList: IUser[];
  searchUser: (searchString: string) => Promise<void>;
  selectOrRemoveUser: (user: IUser) => void;
  clearUserList: () => void;
  presetSelectedUsers: (users: IUser[]) => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  loadingUser: false,
  selectedUsers: [],
  userList: [],

  searchUser: async (searchString: string) => {
    

    set({ loadingUser: true, userList: []});

    const res: IUser[] = await POST({searchUserName: searchString, excludeList:get().selectedUsers.map(x => x.id)}, "/user/get-searched-user");
    set({ loadingUser: false });
    get().userList = res.map((x) => {
      return { ...x, isSelected: get().selectedUsers.find((y) => y.id === x.id) ? true : false };});
  },

  selectOrRemoveUser: (user: IUser) => {

    const userIndex = get().selectedUsers.findIndex((x) => x.id === user.id);
    if (userIndex === -1) {
      set({ 
        selectedUsers: [...get().selectedUsers, user], 
        userList: [...get().userList.map(x => { return {...x, isSelected: (user.id === x.id ? true : x.isSelected)}})]
      });
    } else {
      set({
        selectedUsers: get().selectedUsers.filter((x) => x.id !== user.id),
        userList: [...get().userList.map(x => { return {...x, isSelected: (user.id === x.id ? false : x.isSelected)}})]
      });
    }
  },

  clearUserList:() =>{
    set({userList:[]})
  },

  presetSelectedUsers: (users: IUser[]) => {
    set({selectedUsers: users})
  },

}));
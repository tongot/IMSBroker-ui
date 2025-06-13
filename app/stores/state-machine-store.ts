import { create } from "zustand";
import { GET } from "../utils/http/GET";
import { ICoverState } from "../utils/interfaces/state-machine/cover-state";
import { IAddCoverState } from "../utils/interfaces/state-machine/add-cover-state";
import IHttpResponse from "../utils/http/http-response";
import POST from "../utils/http/POST";
import DELETE from "../utils/http/DELETE";
import PUT from "../utils/http/PUT";
import { toast } from "react-toastify";
import NotifyIHttpResponse from "../utils/notifications-toaster";

type StateMachineStore = {
  loadingStates: boolean;
  coverStates: ICoverState[];
  getStates: (coverId: number) => Promise<void>;
  addState: (state: IAddCoverState) => Promise<void>;
  updateState: (state: IAddCoverState) => Promise<void>;
  removeState: (stateId: number) => Promise<void>;
};

export const useStateMachineStore = create<StateMachineStore>((set, get) => ({
  loadingStates: false,
  coverStates: [],
  error: "",
  success: false,

  getStates: async (coverId) => {
    set({ loadingStates: true });
    const res = await GET<ICoverState[]>(
      `/StateMachine/CoverStructureState/${coverId}`
    );
    set({ loadingStates: false, coverStates: res });
  },

  addState: async (newState: IAddCoverState) => {
    debugger;
    set({ loadingStates: true});
    const res: IHttpResponse<boolean> = await POST(newState, "/StateMachine");
    set({ loadingStates: false });
    if(res.success){
        toast.success("State added successfully!");
    }
    else{
        toast.error("Failed to add state!");
    }
    get().getStates(newState.coverStructureId);
    NotifyIHttpResponse (res);
  },

  removeState: async (stateId: number) => {
    set({ loadingStates: true });
    const res:IHttpResponse<boolean> = await DELETE(
      `/StateMachine/CoverStructureStateDelete/${stateId}`
    );
    set({
      loadingStates: false,
      coverStates: get().coverStates.filter((x) => x.id !== stateId),
    });
    NotifyIHttpResponse (res);
  },

  updateState: async (state: IAddCoverState) => {
    set({ loadingStates: true });
    const res: IHttpResponse<boolean> = await PUT(
      state,
      "/StateMachine/CoverStructureStateUpdate"
    );
    set({ loadingStates: false });
    get().getStates(state.coverStructureId);
    NotifyIHttpResponse (res);
  },
}));


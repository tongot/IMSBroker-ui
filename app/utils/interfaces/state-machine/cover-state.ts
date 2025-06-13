import { IStateUser } from "./state-user";

export interface ICoverState {
    id : number;
    name : string;
    order : number;
    isActiveState : boolean;
    isFinalState : boolean;
    isInitialState : boolean;
    coverStructureId : number;
    stateCategory : string;
    requireUnderwriterApprovals : boolean;
    isActive : boolean;
    users : IStateUser[];

}

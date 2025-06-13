export interface IAddCoverState {
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
    userIds : string[];
}
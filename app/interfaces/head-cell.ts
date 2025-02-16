import IEntity from "./ientity";

export default interface IHeadCell extends IEntity {
    disablePadding: boolean;
    label: string;
    numeric: boolean;
    
  }
import IEntity from "./ientity";

export default interface IHeadCell extends IEntity {
    disablePadding: boolean;
    label: string;
    type: "text"| "number" | "date" | "datetime" | "time" | "currency" |"boolean"|"component";
    alignment?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    width?: string;
  }
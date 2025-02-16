import IPosting from "../iposting";

export default interface ICoverStructureField extends IPosting{
  id: number;
  name: string;
  type: number;
  hint: string;
  isRequired: boolean;
  isActive: boolean;
  defaultValue: string;
  coverStructureId: number;
}

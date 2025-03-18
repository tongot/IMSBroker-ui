import IPosting from "../iposting";
import IValidationProperties from "../validation-properties";

export default interface ICoverStructureField extends IPosting, IValidationProperties{
  id: number;
  hint: string;
  isActive: boolean;
  defaultValue: string;
  coverStructureId: number;
  subHeading:string;
  validationPattern:string;
  order:number;
  validationObject:string;
  insuranceMainTypeId:number;
}

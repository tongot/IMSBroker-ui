import IPosting from "../iposting";

export default interface IDefaultAddOn extends IPosting {
  id: number;
  rate: number;
  name: string;
  insuranceMainTypeId: number;
  description: number;
  insuranceTypeName:string;
}

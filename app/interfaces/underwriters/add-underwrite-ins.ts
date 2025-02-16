import IPosting from "../iposting";

export default interface IAddUnderwriterIns extends IPosting {
  id: number;
  totalCommission: number;
  commission: number;
  vat: number;
  underwriterId: number;
  insuranceMainTypeId: number;
}

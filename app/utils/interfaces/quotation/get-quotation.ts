import IPosting from "../iposting";
import IPolicyField from "../policy/policy-field";
import IAddAddOn from "./IAddAddOn";

export default interface IGetQuotation extends IPosting{
    sumInsured?: number;
    sumAssured?: number;
    insurableValue?: number;
    expectedMedicalCost?: number;
    riskLoading?: number;
    insuranceType: string;
    insuranceTypeId: number;
    fields?: IPolicyField[];
    addOns?:IAddAddOn[];
}
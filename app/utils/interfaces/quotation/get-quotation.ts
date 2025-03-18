import IPosting from "../iposting";
import IPolicyField from "../policy/policy-field";

export default interface IGetQuotation extends IPosting{
    sumInsured?: number;
    sumAssured?: number;
    insurableValue?: number;
    expectedMedicalCost?: number;
    riskLoading?: number;
    insuranceType: string;
    fields?: IPolicyField[];
}
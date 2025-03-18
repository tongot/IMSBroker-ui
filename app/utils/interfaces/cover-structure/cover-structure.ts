import IPosting from "../iposting";

export default interface ICoverStructure extends IPosting {
     id :number;
     name :string;
     rate :number;
     description :string;
     hasDependencies :boolean;
     hasBeneficiary :boolean;
     underwriterId :number;
     underwriterInsuranceId :number;
}
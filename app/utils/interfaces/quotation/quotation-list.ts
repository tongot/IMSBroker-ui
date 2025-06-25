import IEntity from "../ientity";

export default interface IQuotationList extends IEntity {
    coverName?: string;
    underwriterName?: string;
    finalPremium?: number;
    qouteNumber?: string;
    amountInsured?: number;
    excess?: number;
    personName?: string;
    createdBy?: string | undefined;
    maybeModifiedOn?: Date;
}
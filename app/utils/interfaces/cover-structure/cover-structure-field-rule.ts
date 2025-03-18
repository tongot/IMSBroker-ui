import IPosting from "../iposting";

export default interface ICoverStructureFieldRule extends IPosting {
    id: number;
    coverStructureFieldId: number;
    fieldName: string;
    operator: string;
    value: string;
    adjuster: string;
    adjustmentType: string;
    isActive: boolean;
}
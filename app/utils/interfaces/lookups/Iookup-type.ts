import IPosting from "../iposting";

export default interface ILookupType extends IPosting{
    id:number,
    description: string;
    name: string;
}
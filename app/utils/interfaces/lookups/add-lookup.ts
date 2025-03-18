import IPosting from "../iposting";

export default interface IAddLookup extends IPosting{
    id: number;
    name: string;
    description: string;
    lookupTypeId: number;
}
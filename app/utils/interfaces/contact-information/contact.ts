import IPosting from "../iposting";

export default interface IAddContact extends IPosting{
    id? : number;
    mobileNumber : string;
    tel: string;
    email: string;
}
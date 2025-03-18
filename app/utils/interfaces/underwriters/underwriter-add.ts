import IAddAddress from "../contact-information/address";
import IAddContact from "../contact-information/contact";
import IPosting from "../iposting";

export default interface IAddUnderwriter extends IPosting {
    id?: number;
    name: string;
    status: number;
    contact: IAddContact[];
    address: IAddAddress[];
}
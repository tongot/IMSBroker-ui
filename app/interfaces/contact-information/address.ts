import IEntity from "../ientity";
import IPosting from "../iposting";

export default interface IAddAddress extends IPosting {
    id?:number;
    city :string
    street :string
    postalCode :string
    country :string
    addressType :number
}

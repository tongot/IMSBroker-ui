import IFieldCategory from "./field-category";
import IFieldOption from "./field-option";

export default interface IFieldView{
    categorisedFields: IFieldCategory[];
    options:IFieldOption[];
}
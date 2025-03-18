export default interface IValidationProperties{
    type:string;
    name:string
    isPositiveNumber?:boolean;
    min?:number;
    max?:number;
    match?:string;
    greaterThan?:string;
    lessThan?:string;
    isRequired: boolean;
}
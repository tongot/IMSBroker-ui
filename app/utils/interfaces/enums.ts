 class Enums{
    constructor( number: string, value: number| string) {
        this.member = number;
        this.value = value
    }
    member: string = '';
    value: number | string = 0
}

const AddressType = [
  new Enums('Postal Address', 0),
  new Enums('Physical Address', 1),
];

const UnderwriterStatus = [
  new Enums('Active', 0),
  new Enums('Inactive', 1),
];

const FieldTypes = [
  new Enums('Text','text'),
  new Enums('Date','date'),
  new Enums('Expanded Text','expanded-text'),
  new Enums('Number','number'),
  new Enums('Options','options'),
  new Enums('True/false','bool'),

]

const AdjusterTypes = [
  new Enums('Percentage','percentage'),
  new Enums('Flat','flat')
]

const Operators = [
  new Enums("Equal", "=="),
  new Enums("Not Equal", "!="),
  new Enums("Greater Than", ">"),
  new Enums("Less Than", "<"),
  new Enums("Greater Than or Equal", ">="),
  new Enums("Less Than or Equal", "<="),
  new Enums("In", "IN"),
  new Enums("Not In", "NOT-IN"),
];

export { AddressType, UnderwriterStatus, FieldTypes, AdjusterTypes, Operators };
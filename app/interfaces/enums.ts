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
  new Enums('Bool','bool'),

]

export { AddressType, UnderwriterStatus, FieldTypes };
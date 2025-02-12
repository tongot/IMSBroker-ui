 class Enums{
    constructor( number: string, value: number) {
        this.member = number;
        this.value = value
    }
    member: string = '';
    value: number = 0
}

const AddressType = [
  new Enums('Postal Address', 0),
  new Enums('Physical Address', 1),
];

const UnderwriterStatus = [
  new Enums('Active', 0),
  new Enums('Inactive', 1),
];

export { AddressType, UnderwriterStatus };
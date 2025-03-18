import IPosting from "../iposting";

export default interface IPerson extends IPosting {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: Date;
    identityNumber: string;
    genderId?: number;
    nationalityId?: number;
    titleId?: number;
    maritalStatusId?: number;
    occupationId?: number;
    identityTypeId?: number;
    raceId?: number;
}
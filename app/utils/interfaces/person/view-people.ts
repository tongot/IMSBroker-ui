import IPerson from "./add-person";

export default interface IPeople extends IPerson {
    gender: string;
    nationality: string;
    title: string;
    maritalStatus: string;
    occupation: string;
    identityType: string;
    race: string;
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: Date;
    identityNumber: string;
}
import IPosting from "../iposting";

export default interface IAddUser extends IPosting {
  userName: string;
  password: string;
}

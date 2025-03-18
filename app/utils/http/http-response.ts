export default interface IHttpResponse<T> {
    success: boolean;
    message: string;
    data:T;
}
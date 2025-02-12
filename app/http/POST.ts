import axios from "axios";
import IPosting from "../interfaces/iposting";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5091/api";
export default async function POST<T extends IPosting>(data: T) {
  try {
    const token = localStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.post["Content-Type"] = "application/json";

    const res = await axios.post(`${apiUrl}${data.url}`, data);
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      console.log("Error fetching data", e);
      if (e.response?.status === 401) {
        localStorage.setItem("token", "token");
        window.location.href = "/login";
      }
    }
    throw new Error("Error Adding data");
  }
}

import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5091/api";

export async function GET<T>(url: string): Promise<T> {
  try {
    const token = localStorage.getItem("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    const res = await axios.get<T>(`${apiUrl}${url}`);
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.response?.status === 401) {
        localStorage.setItem("token", "token");
        window.location.href = "/login";
      }
    }
    return null as T;
  }
}




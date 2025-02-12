"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";

const url = process.env.REACT_APP_API_URL || "http://localhost:5091/api";
const localUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (typeof window !== "undefined") {
    if (localStorage.getItem("token") == "token") {
      localStorage.removeItem("token");
      signOut({ callbackUrl: `${localUrl}/login` });
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "" || password === "") {
      setError("Please fill in all fields");
    } else {
      try {
        console.log(process.env.REACT_APP_API_URL);
        const apiRes = await axios.post(`${url}/User/token`, {
          username,
          password,
        });
        if (apiRes.data) {
          localStorage.setItem("token", apiRes.data.token);

          const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
          });
          if (res?.error) {
            setError(res.error);
          }
        }
      } catch (e:unknown) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data.message);
        }
      }
    }
  };

  return (
    <div>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <>
          {session ? (
            <div>
              <p>Logged in as: {session.user?.name}</p>
              <button onClick={() => signOut()}>Logout</button>
            </div>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "100px",
                width: "100%",
              }}
            >
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Box textAlign="center" marginBottom="20px">
                  <Typography variant="h4">Login</Typography>
                </Box>
                {error && (
                  <Box marginBottom="10px">
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  </Box>
                )}
                <form onSubmit={handleLogin}>
                  <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "20px" }}
                    startIcon={<LockIcon />}
                  >
                    Login
                  </Button>
                </form>
              </Paper>
            </Box>
          )}
        </>
      )}
    </div>
  );
}

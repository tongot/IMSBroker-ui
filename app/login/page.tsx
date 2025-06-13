"use client";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Avatar,
  CssBaseline,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid2";

const url = process.env.REACT_APP_API_URL || "http://localhost:5091/api";
const localUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const router = useRouter();

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
      setLoginLoading(false);
    } else {
      try {
        setLoginLoading(true);
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
          } else {
            router.push("/dashboard");
          }
        }
        setLoginLoading(false);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data.message);
        }
        setLoginLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ mt: 1, width: "100%" }}
        >
          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginLoading}
            startIcon={loginLoading ? <CircularProgress size={20} /> : null}
          >
            {loginLoading ? "Signing In..." : "Sign In"}
          </Button>
          <Grid container>
            <Grid size={{ xs: 12 }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
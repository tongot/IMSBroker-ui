import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{number}}",
    },
  },
};

export default nextConfig;

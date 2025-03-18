"use client";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { alpha } from "@mui/material/styles";

interface MainContainerProps {
  children: React.ReactNode;
  heading: string;
  icon: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({
  children,
  icon,
  heading,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "background.default",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.secondary",
          }}
        >
          {icon}
          <Typography variant="h6" component="h1" fontWeight="bold">
            {heading}
          </Typography>
        </Box>

        {/* Divider */}
        <Divider />

        {/* Content Section */}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default MainContainer;
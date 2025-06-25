"use client";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { alpha } from "@mui/material/styles";

interface MainContainerProps {
  children: React.ReactNode;
  heading: string;
  icon: React.ReactNode;
  buttons?: React.ReactNode; // Optional buttons section
}

const MainContainer: React.FC<MainContainerProps> = ({
  children,
  icon,
  heading,
  buttons,
}) => {
  return (
    <Box sx={{ width: "100%", height: "90vh", pt: 1 }}>
      <Paper
        elevation={0}
        sx={{
          height: "90vh",
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
            justifyContent: "space-between",
            gap: 1,
            background: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: "primary.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            <Typography variant="h6" component="h1" fontWeight="bold">
              {heading}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {buttons}
          </Box>
        </Box>

        {/* Divider */}
        <Divider />

        {/* Content Section */}
        <Box sx={{ overflow: "auto", height: "80vh", pt: 1 }}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default MainContainer;

"use client";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

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
    <Box>
      <Paper>
        <Box
          sx={{
            padding: "10px",
            display: "flex",
            alignContent: "center",
            justifyContent: "start",
            gap: "5px",
          }}
        >
          {icon}
          <Typography variant="h4" gutterBottom>
            {heading}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{padding:"7px"}}>{children}</Box>
      </Paper>
    </Box>
  );
};

export default MainContainer;

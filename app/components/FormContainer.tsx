"use client";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import SaveIcon from "@mui/icons-material/Save";

interface FormContainerProps {
  width: object;
  icon: React.ReactNode;
  heading: string;
  children: React.ReactNode;
  closeFn: () => void;
  action: () => void;
  loading: boolean;
}
const FormContainer: React.FC<FormContainerProps> = ({
  width,
  icon,
  heading,
  children,
  closeFn,
  action,
  loading
}) => {
  return (
    <form noValidate onSubmit={action}>
    <Box>
      <Paper
        elevation={0}
        sx={{
          width: width,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-between",
            gap: "5px",
            padding: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
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
          <Box>
            <Tooltip title="Close">
                <IconButton onClick={closeFn}>
                  <CloseIcon />
                </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
        {children}
        <Divider />
        <Box sx={{ padding: "1rem", display: "flex", justifyContent: "end" }}>
          <Button loading={loading} onClick={action} variant="contained" startIcon={<SaveIcon />}>
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
    </form>
  );
};

export default FormContainer;

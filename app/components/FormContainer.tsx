"use client";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

interface FormContainerProps {
  width?: object | string; // Allow both object and string for width
  icon: React.ReactNode;
  heading: string;
  children: React.ReactNode;
  closeFn: () => void;
  action: (e?: React.FormEvent) => void; // Allow optional event parameter
  loading: boolean;
  btnText?: string;
  disableSubmit?: boolean; // Add a prop to disable the submit button
}

const FormContainer: React.FC<FormContainerProps> = ({
  width = { xs: "90%", sm: "70%", md: "50%" }, // Default responsive width
  icon,
  heading,
  children,
  closeFn,
  action,
  loading,
  btnText,
  disableSubmit = false, // Default to false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    action(e); // Pass the event to the action function
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: width,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            <Typography variant="h6" component="h4">
              {heading}
            </Typography>
          </Box>
          <Tooltip title="Close">
            <IconButton
              onClick={closeFn}
              sx={{ color: "primary.contrastText" }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Divider */}
        <Divider />

        {/* Form Content */}
        <Box sx={{ p: 3 }}>{children}</Box>

        {/* Divider */}
        <Divider />

        {/* Footer Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || disableSubmit}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : btnText ? (
                icon
              ) : (
                <SaveIcon />
              )
            }
            sx={{ minWidth: 120 }}
          >
            {loading ? "Saving..." : btnText ? btnText : "Save"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormContainer;
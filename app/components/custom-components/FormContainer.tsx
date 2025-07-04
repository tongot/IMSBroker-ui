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
  closeFn?: () => void;
  action: (e?: React.FormEvent) => void; // Allow optional event parameter
  loading: boolean;
  btnText?: string;
  loadingBtnText?:string;
  btnIcon?:React.ReactNode;
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
  loadingBtnText,
  btnIcon,
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
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: width,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            <Typography variant="h6" component="h4">
              {heading}
            </Typography>
          </Box>
          {closeFn &&<Tooltip title="Close">
            <IconButton
              onClick={closeFn}
              sx={{ color: "primary" }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>}
        </Box>
        <Divider/>
        {/* Form Content */}
        <Box sx={{ p: 1 }}>{children}</Box>

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
              ) : btnIcon ? (
                btnIcon
              ) : (
                <SaveIcon />
              )
            }
            sx={{ minWidth: 120 }}
          >
            {loading ? (loadingBtnText ? loadingBtnText : "Saving...") : (btnText ? btnText : "Save")}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FormContainer;
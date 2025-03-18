"use client";
import { Dialog } from "@mui/material";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import AccountCircleRound from "@mui/icons-material/AccountCircleRounded";
import { FieldValues, UseFormHandleSubmit } from "react-hook-form";

interface RenderProps {
  onClose: <T>(data: T) => void;
  handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
  formContent: React.ReactNode;
  heading:string;
  loading: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const useFormDialogContainer = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const open = () => {
    setOpenDialog(true);
  };

  const width = { xs: "100%", sm: "100%", md: "100%" };
  const icon = <AccountCircleRound sx={{ fontSize: 34 }} />;
  const close = () => setOpenDialog(false);

  return {
    open,
    setOpenDialog,
    close,
    render: ({
      onClose,
      handleSubmit,
      formContent,
      heading,
      loading,
      maxWidth
    }: RenderProps) => (
      <Dialog fullWidth maxWidth={maxWidth} open={openDialog}>
        <FormContainer
          icon={icon}
          heading={heading}
          width={width}
          closeFn={close}
          action={handleSubmit((data) => onClose({ ...data }))}
          loading={loading}
        >
          {formContent}
        </FormContainer>
      </Dialog>
    ),
  };
};

export default useFormDialogContainer;

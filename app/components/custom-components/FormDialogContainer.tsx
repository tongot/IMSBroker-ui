"use client";
import { Dialog } from "@mui/material";
import React, { useState } from "react";
import FormContainer from "./FormContainer";
import AccountCircleRound from "@mui/icons-material/AccountCircleRounded";
import { FieldValues, UseFormHandleSubmit } from "react-hook-form";

interface RenderProps {
  onSubmit: <T>(data: T) => void;
  handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
  onClose?: () => void;
  formContent: React.ReactNode;
  heading: string;
  loading: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  btnLoadingTxt?: string;
  btnIcon?: React.ReactNode;
  btnText?: string;
  btnDisabled?: boolean;
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
      onSubmit,
      handleSubmit,
      onClose,
      formContent,
      heading,
      loading,
      maxWidth,
      btnLoadingTxt,
      btnIcon,
      btnText,
      btnDisabled = false,
    }: RenderProps) => (
      <Dialog fullWidth maxWidth={maxWidth} open={openDialog}>
        <FormContainer
          icon={icon}
          heading={heading}
          width={width}
          closeFn={onClose ? onClose : close}
          action={handleSubmit((data) => onSubmit({ ...data }))}
          loading={loading}
          btnIcon={btnIcon}
          loadingBtnText={btnLoadingTxt}
          btnText={btnText}
          disableSubmit={btnDisabled}
        >
          {formContent}
        </FormContainer>
      </Dialog>
    ),
  };
};

export default useFormDialogContainer;

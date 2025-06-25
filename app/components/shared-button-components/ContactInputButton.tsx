"use client";
import React from "react";
import useFormDialogContainer from "../custom-components/FormDialogContainer";
import { useForm } from "react-hook-form";
import { Box, IconButton, TextField } from "@mui/material";
import { useContactStore } from "@/app/stores/contact-store";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import IAddContact from "@/app/utils/interfaces/contact-information/contact";

interface ContactInputButtonProps {
  editContact?:IAddContact;
  entityId:number;
  entityType:string;
}
const ContactInputButton = ({editContact, entityId, entityType}:ContactInputButtonProps) => {
  const dialog = useFormDialogContainer();
  const saveContact = useContactStore((state) => state.saveContact);
  const loadingContacts = useContactStore((state) => state.loadingContacts);
  const updateContact = useContactStore((state) => state.updateContact);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const form = (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email is not valid",
          },
        })}
        error={!!errors.email}
        helperText={String(errors.email?.message || "")}
        name="email"
        label="Email"
        defaultValue={editContact?.email}
      ></TextField>
      <TextField
        type="number"
        {...register("mobileNumber", {
          required: "Mobile number is required",
          maxLength: {
            value: 13,
            message: "Mobile number must be 10 digits",
          },
          minLength: {
            value: 8,
            message: "Mobile number must at least 8 chars",
          },
        })}
        error={!!errors.mobileNumber}
        helperText={String(errors.mobileNumber?.message || "")}
        label="Mobile Number"
        defaultValue={editContact?.mobileNumber}
      ></TextField>
      <TextField
        type="number"
        {...register("tel", {
          maxLength: {
            value: 5,
            message: "Mobile number must be 10 digits",
          },
        })}
        error={!!errors.tel}
        helperText={String(errors.tel?.message || "")}
        label="Telephone"
        defaultValue={editContact?.tel}
      ></TextField>
    </Box>
  );

  const handleCreateContact = (data: IAddContact) => {
    if(editContact){
      data.id = editContact.id;
      updateContact(data,entityId, entityType);
      dialog.close();
      return
    }
    saveContact(data, entityId, entityType);
    reset();
    dialog.close();
  };

  const openDialogAddContact = () => {
    dialog.open();
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreateContact(data as IAddContact),
        formContent: form,
        heading: "New underwriter contact",
        loading:loadingContacts
      })}
      <IconButton
        onClick={openDialogAddContact}
      >
         {editContact ?<EditIcon color="success"/>:<AddIcon/>}
      </IconButton>
    </div>
  );
};

export default ContactInputButton;

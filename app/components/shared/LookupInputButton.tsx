"use client";
import React from "react";
import useFormDialogContainer from "../FormDialogContainer";
import { useForm } from "react-hook-form";
import { Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IAddLookup from "@/app/utils/interfaces/lookups/add-lookup";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import { queryClient } from "../Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useLookupStore } from "@/app/stores/lookup-store";
import IHttpResponse from "@/app/utils/http/http-response";

interface Props {
  editLookup?: IAddLookup;
  lookupTypeId: number;
  lookupTypes: string;
}
const LookupInputButton = ({
  editLookup,
  lookupTypeId,
  lookupTypes,
}: Props) => {
  const dialog = useFormDialogContainer();
  const notifications = useNotifications();
  const getLookupsFor = useLookupStore((state) => state.getLookupFor);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IAddLookup) => POST(data, data.url),
    onSuccess: (data: IHttpResponse<string>) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["lookup"] });
        notifications.show("Done", {
          severity: "success",
          autoHideDuration: 3000,
        });
        dialog.close();
        getLookupsFor(lookupTypes);
        reset();
      } else {
        notifications.show("Failed - " + data.message, {
          severity: "warning",
          autoHideDuration: 7000,
        });
      }
    },
    onError: () => {
      notifications.show("Failed to add lookup", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

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
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters long",
          },
        })}
        error={!!errors.name}
        helperText={String(errors.name?.message || "")}
        name="name"
        label="Name"
        defaultValue={editLookup?.name}
      ></TextField>
      <TextField
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 2,
            message: "Description must be at least 2 chars long",
          },
        })}
        error={!!errors.description}
        helperText={String(errors.description?.message || "")}
        label="Description"
        defaultValue={editLookup?.description}
      ></TextField>
    </Box>
  );

  const handleCreateLookup = (data: IAddLookup) => {
    if (editLookup) {
      data.id = editLookup.id;
    }
    data.url = "/lookup/new-lookup";
    data.lookupTypeId = lookupTypeId;
    mutate(data);
  };

  const openDialogAddContact = () => {
    dialog.open();
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreateLookup(data as IAddLookup),
        formContent: form,
        heading: "Lookup - "+ lookupTypes,
        loading: isPending,
      })}
      <IconButton onClick={openDialogAddContact}>
        {editLookup ? <EditIcon color="success" /> : <AddIcon />}
      </IconButton>
    </div>
  );
};

export default LookupInputButton;

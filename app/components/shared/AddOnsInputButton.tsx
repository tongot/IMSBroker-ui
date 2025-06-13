"use client";
import React, { useEffect } from "react";
import useFormDialogContainer from "../FormDialogContainer";
import { useForm } from "react-hook-form";
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import { queryClient } from "../Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useInsTypeStore } from "@/app/stores/lookup-store";
import IHttpResponse from "@/app/utils/http/http-response";
import IDefaultAddOn from "@/app/utils/interfaces/cover-structure/add-on";

interface Props {
    editAddOn?: IDefaultAddOn
}
const AddOnsInputButton = ({
 editAddOn
}: Props) => {

  const dialog = useFormDialogContainer();
  const notifications = useNotifications();

  const getInsType = useInsTypeStore(state => state.getInsTypes)
  const insTypes = useInsTypeStore(state => state.insuranceTypes)

  useEffect(()=>{
    getInsType();
  },[getInsType])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IDefaultAddOn) => POST(data, data.url),
    onSuccess: (data: IHttpResponse<string>) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["addons"] });
        notifications.show("Done", {
          severity: "success",
          autoHideDuration: 3000,
        });
        dialog.close();
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
        defaultValue={editAddOn?.name}
      ></TextField>
      <TextField
        type="number"
        {...register("rate", {
          required: "Rate is required",
          max: {
            value: 100,
            message: "Rate must be less than 100",
          },
        })}
        error={!!errors.rate}
        helperText={String(errors.rate?.message || "")}
        label="Rate"
        defaultValue={editAddOn?.rate}
      ></TextField>
      <TextField
        {...register("description", {
          required: "Description is required",
          minLength: {
            value: 2,
            message: "Description must be at least 2 characters long",
          },
        })}
        error={!!errors.description}
        helperText={String(errors.description?.message || "")}
        name="description"
        label="Description"
        defaultValue={editAddOn?.description}
      ></TextField>
      <FormControl fullWidth>
          <InputLabel id="ins-type-select-label">Insurance Type</InputLabel>
          <Select
            labelId="ins-type-select-label"
            id="ins-type-select"
            {...register("insuranceMainTypeId", {})}
            error={!!errors.insuranceMainTypeId}
            label="Insurance Type"
            defaultValue={
              editAddOn?.insuranceMainTypeId || insTypes[0]?.id || 0
            }
          >
            {insTypes.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
    </Box>
  );

  const handleCreateAddOn = (data: IDefaultAddOn) => {

    if (editAddOn) {
      data.id = editAddOn.id;
    }
    data.url = "/addons";
    mutate(data);
  };

  const openDialogAddAddon = () => {
    reset();
    dialog.open();
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreateAddOn(data as IDefaultAddOn),
        formContent: form,
        heading: "Lookup - "+ editAddOn?.name,
        loading: isPending,
      })}
      <IconButton onClick={openDialogAddAddon}>
        {editAddOn ? <EditIcon color="success" /> : <AddIcon />}
      </IconButton>
    </div>
  );
};

export default AddOnsInputButton;

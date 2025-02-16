"use client";
import useFormDialogContainer from "@/app/components/FormDialogContainer";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/http/POST";
import { queryClient } from "@/app/components/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import IHttpResponse from "@/app/http/http-response";
import ICoverStructureField from "@/app/interfaces/cover-structure/cover-structure-field";
import { FieldTypes } from "@/app/interfaces/enums";

interface AddCoverStructureFieldFormProps {
  editStructureField?: ICoverStructureField;
  coverStructureId: number;
  refetchField:() => void;
}
const AddCoverStructureFieldForm = ({
    editStructureField,
    coverStructureId,
    refetchField
}: AddCoverStructureFieldFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();

  const dialog = useFormDialogContainer();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICoverStructureField) => POST(data),

    onSuccess: (data: IHttpResponse<ICoverStructureField>) => {
      queryClient.invalidateQueries({ queryKey: ["underwriters-covers-field"+coverStructureId] });
      if (data.success) {
        refetchField();
        notifications.show(
          `${editStructureField ? "Updated" : "Added"} Cover Field successful`,
          {
            severity: "success",
            autoHideDuration: 3000,
          }
        );
        dialog.close();
        reset();
      } else {
        notifications.show(data.message, {
          severity: "warning",
          autoHideDuration: 7000,
        });
      }
    },
    onError: () => {
      notifications.show("Failed please try again later or report issue", {
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
        label="Field Name"
        defaultValue={editStructureField?.name}
        {...register("name", { required: "Name is required" })}
      ></TextField>

      <TextField
        {...register("hint")}
        error={!!errors.hint}
        helperText={String(errors.hint?.message || "")}
        label="Hint"
        defaultValue={editStructureField?.hint}
      ></TextField>

       <TextField
        {...register("defaultValue")}
        error={!!errors.defaultValue}
        helperText={String(errors.defaultValue?.message || "")}
        label="Default Value"
        defaultValue={editStructureField?.defaultValue}
      ></TextField>

     <FormControl fullWidth>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label-select-label"
          id="type-label-select"
          {...register("type", {})}
          error={!!errors.type}
          label="Status"
          defaultValue={editStructureField?.type || FieldTypes[0].value}
        >
          {FieldTypes.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.member}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              {...register("isRequired")}
              defaultChecked={editStructureField?.isRequired}
            />
          }
          label="Required"
        />
         <FormControlLabel
          control={
            <Checkbox
              {...register("isActive")}
              defaultChecked={editStructureField?.isActive}
            />
          }
          label="Active"
        />
      </FormGroup>
    </Box>
  );

  const handleCreateCover = (data: ICoverStructureField) => {
    data.coverStructureId = coverStructureId;

    if (editStructureField) {
      data.id = editStructureField.id;
      data.url = "/CoverStructure/field/update";
      mutate({ ...data });
      return;
    }
    data.url = "/CoverStructure/field";
    mutate({ ...data });
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onClose: (data) =>
          handleCreateCover(data as ICoverStructureField),
        formContent: form,
        heading: "New Field",
        loading: isPending,
      })}

      <Button
      variant="outlined"
        startIcon={
        editStructureField ? <EditIcon color="success" /> : <AddIcon />
        }
        onClick={() => {
          dialog.open();
          reset();
        }}
      >
        {editStructureField ? 'Edit' : 'Field'}
      </Button>
    </div>
  );
};

export default AddCoverStructureFieldForm;

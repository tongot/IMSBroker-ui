"use client";
import useFormDialogContainer from "@/app/components/custom-components/FormDialogContainer";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import ICoverStructure from "@/app/utils/interfaces/cover-structure/cover-structure";
import IHttpResponse from "@/app/utils/http/http-response";
import POST from "@/app/utils/http/POST";

interface AddCoverStructureFormProps {
  editStructure?: ICoverStructure;
  underwriterId: number;
  insTypeId: number;
}
const AddCoverStructureForm = ({
  editStructure,
  underwriterId,
  insTypeId
}: AddCoverStructureFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();

  const dialog = useFormDialogContainer();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICoverStructure) => POST(data, data.url),

    onSuccess: (data: IHttpResponse<ICoverStructure>) => {
      queryClient.invalidateQueries({ queryKey: ["underwriters-covers"+insTypeId] });
      if (data.success) {
        notifications.show(
          `${editStructure ? "Updated" : "Added"} Cover successful`,
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
        label="Name"
        defaultValue={editStructure?.name}
        {...register("name", { required: "Name is required" })}
      ></TextField>

      <TextField
        type="number"
        {...register("rate", {
          required: "Rate is required",
          min: { value: 0, message: "Rate must be greater than 0" },
          max: {value: 100, message: "Rate must be below 100%"}
        })}
        error={!!errors.rate}
        helperText={String(errors.rate?.message || "")}
        label="Rate"
        defaultValue={editStructure?.rate}
      ></TextField>

      <TextField
        multiline
        rows={4}
        {...register("description", {
          required: "description is required",
        })}
        error={!!errors.description}
        helperText={String(errors.description?.message || "")}
        label="Description"
        defaultValue={editStructure?.description}
      ></TextField>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              {...register("hasBeneficiary")}
              defaultChecked={editStructure?.hasBeneficiary}
            />
          }
          label="Has Beneficiary"
        />
         <FormControlLabel
          control={
            <Checkbox
              {...register("hasDependencies")}
              defaultChecked={editStructure?.hasDependencies}
            />
          }
          label="Has Dependencies"
        />
      </FormGroup>
    </Box>
  );

  const handleCreateCover = (data: ICoverStructure) => {
    data.underwriterId = underwriterId;
    data.underwriterInsuranceId = insTypeId;

    if (editStructure) {
      data.id = editStructure.id;
      data.url = "/CoverStructure/update";
      mutate({ ...data });
      return;
    }
    data.underwriterId = underwriterId;
    data.url = "/CoverStructure";
    mutate({ ...data });
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) =>
          handleCreateCover(data as ICoverStructure),
        formContent: form,
        heading: "New Cover",
        loading: isPending,
      })}

      <Button
      variant="contained"
        fullWidth
        startIcon={
        editStructure ? <EditIcon/> : <AddIcon />
        }
        onClick={() => {
          dialog.open();
          reset();
        }}
      >
        {editStructure ? 'Edit' : 'Add New Structure'}
      </Button>
    </div>
  );
};

export default AddCoverStructureForm;

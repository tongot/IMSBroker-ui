"use client";
import useFormDialogContainer from "@/app/components/FormDialogContainer";
import {
  Box,
  Button,
  FormControl,
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
import { queryClient } from "@/app/components/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import ICoverStructure from "@/app/utils/interfaces/cover-structure/cover-structure";
import POST from "@/app/utils/http/POST";
import {
  ApiResponseOfString,
  ICreateAddOnCustomeRateCommand,
  IGetCoverStructureAddOnDto,
} from "@/app/api/ims-client";
import { toast } from "react-toastify";
import { useAddonsQuery } from "@/app/utils/queries/add-ons";
import LoadingPage from "@/app/components/LoadingPage";

interface AddOnOverrideFormProps {
  coverAddOn?: IGetCoverStructureAddOnDto;
  coverId: number;
}

const AddOnOverrideForm = ({
  coverAddOn,
  coverId,
}: AddOnOverrideFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();

  const dialog = useFormDialogContainer();

  const { data, isLoading } = useAddonsQuery();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICreateAddOnCustomeRateCommand) =>
      POST(data, "/coverStructure/addon-override/create"),

    onSuccess: (data: ApiResponseOfString) => {
      queryClient.invalidateQueries({ queryKey: ["cover-add-ons" + coverId] });
      if (data.success) {
        toast.success(data.message);
        dialog.close();
        reset();
      } else {
        toast.error(data.message);
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
      {isLoading && <LoadingPage/>}
      {data && (
        <>
          <FormControl fullWidth>
            <InputLabel id="add-on-type-select-label">Add On</InputLabel>
            <Select
              labelId="add-on-type-select-label"
              id="add-on-type-select"
              {...register("addOnId", {})}
              error={!!errors.addOnId}
              label="Add On Type"
              defaultValue={coverAddOn?.defaultAddOnsId || data[0]?.id || 0}
            >
              {data.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="number"
            {...register("rate", {
              required: "Rate is required",
              min: { value: 0, message: "Rate must be greater than 0" },
              max: { value: 100, message: "Rate must be below 100%" },
            })}
            error={!!errors.rate}
            helperText={String(errors.rate?.message || "")}
            label="Rate"
            defaultValue={coverAddOn?.rate}
          ></TextField>
        </>
      )}
    </Box>
  );

  const handleCreateCover = (data: ICreateAddOnCustomeRateCommand) => {
    data.coverStructureId = coverId;
    mutate({ ...data });
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreateCover(data as ICoverStructure),
        formContent: form,
        heading: "New Cover",
        loading: isPending,
      })}

      <Button
        variant="text"
        startIcon={coverAddOn ? <EditIcon /> : <AddIcon />}
        onClick={() => {
          dialog.open();
          reset();
        }}
      >
        {coverAddOn ? "Edit" : "Add New Structure"}
      </Button>
    </div>
  );
};

export default AddOnOverrideForm;

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
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import { queryClient } from "@/app/components/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import IHttpResponse from "@/app/utils/http/http-response";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import { FieldTypes } from "@/app/utils/interfaces/enums";
import Grid from "@mui/material/Grid2";
import { useLookupStore } from "@/app/stores/lookup-store";
import IValidationProperties from "@/app/utils/interfaces/validation-properties";

interface AddCoverStructureFieldFormProps {
  editStructureField?: ICoverStructureField;
  coverStructureId: number;
  isTemplate?: boolean;
  refetchField: () => void;
}
const AddCoverStructureFieldForm = ({
  editStructureField,
  coverStructureId,
  refetchField,
  isTemplate,
}: AddCoverStructureFieldFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();
  const lookupCategories = useLookupStore((state) => state.lookupCategories);
  const getLookupCategories = useLookupStore(
    (state) => state.getLookupCategories
  );
  const loadingOptions = useLookupStore((state) => state.loadingLookup);

  const dialog = useFormDialogContainer();
  const fieldType = watch("type");
  const [selectedField, setSelectedField] = useState(editStructureField?.type);

  useEffect(() => {
    debugger;
    //if (fieldType === "options" || selectedField === "options") {
    getLookupCategories();
    setSelectedField(fieldType);
    //}
    if (editStructureField) {
      setValue("type", editStructureField.type);
    }
  }, [fieldType, getLookupCategories, selectedField]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICoverStructureField) => POST(data, data.url),

    onSuccess: (data: IHttpResponse<ICoverStructureField>) => {
      queryClient.invalidateQueries({
        queryKey: [
          "underwriters-covers-field" + coverStructureId,
          "field-template" + coverStructureId,
        ],
      });
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
          autoHideDuration: 10000,
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

  let objRules: IValidationProperties | undefined = undefined;

  if (editStructureField && editStructureField.validationObject) {
    objRules = JSON.parse(editStructureField.validationObject);
  }

  const form = (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {selectedField}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label-select-label"
                disabled={editStructureField ? true : false}
                id="type-label-select"
                {...register("type", { required: "Type is required" })}
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
            <TextField
              fullWidth
              label="Field Name"
              defaultValue={editStructureField?.name}
              {...register("name", { required: "Name is required" })}
            ></TextField>

            <TextField
              fullWidth
              {...register("subHeading")}
              error={!!errors.subHeading}
              helperText={String(errors.subHeading?.message || "")}
              label="Appear under heading"
              defaultValue={editStructureField?.subHeading}
            ></TextField>

            <TextField
              fullWidth
              type="number"
              {...register("order")}
              error={!!errors.order}
              helperText={String(errors.order?.message || "")}
              label="Order of Appearance"
              defaultValue={editStructureField?.order}
            ></TextField>

            <TextField
              fullWidth
              {...register("hint")}
              error={!!errors.hint}
              helperText={String(errors.hint?.message || "")}
              label="Hint"
              defaultValue={editStructureField?.hint}
            ></TextField>
            {loadingOptions ? <div>Loading...</div> : <></>}
            {fieldType === "options" && (
              <FormControl fullWidth>
                <InputLabel id="defaultValue-label">
                  Option list name
                </InputLabel>
                <Select
                  labelId="defaultValue-label-select-label"
                  id="defaultValue-label-select"
                  {...register("defaultValue", {
                    required: "Options list name is required",
                  })}
                  error={!!errors.defaultValue}
                  label="Options list name"
                  defaultValue={
                    editStructureField?.defaultValue || FieldTypes[0].value
                  }
                >
                  {lookupCategories.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

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
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Stack spacing={2}>
            {fieldType === "number" && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...register("isPositiveNumber")}
                      defaultChecked={
                        objRules ? objRules.isPositiveNumber : false
                      }
                    />
                  }
                  label="Is a positive number"
                />
              </FormGroup>
            )}
            {!["date", "options", "bool"].includes(fieldType) && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    {...register("min")}
                    error={!!errors.min}
                    helperText={String(errors.min?.message || "")}
                    label={
                      "Minimum " + (fieldType === "number" ? "value" : "length")
                    }
                    defaultValue={objRules?.min}
                  ></TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    {...register("max")}
                    error={!!errors.max}
                    helperText={String(errors.max?.message || "")}
                    label={
                      "Maximum " + (fieldType === "number" ? "value" : "length")
                    }
                    defaultValue={objRules?.max}
                  ></TextField>
                </Grid>
              </Grid>
            )}

            {fieldType === "text" && (
              <>
                <TextField
                  fullWidth
                  {...register("validationPattern")}
                  error={!!errors.validationPattern}
                  helperText={String(errors.validationPattern?.message || "")}
                  label="Validation Pattern"
                  defaultValue={editStructureField?.validationPattern}
                ></TextField>
                <TextField
                  fullWidth
                  {...register("match")}
                  error={!!errors.match}
                  helperText={String(errors.match?.message || "")}
                  label="Must match field name"
                  defaultValue={objRules?.match}
                ></TextField>
              </>
            )}
            {["number", "date"].includes(fieldType) && (
              <>
                <TextField
                  fullWidth
                  {...register("greaterThan")}
                  error={!!errors.greaterThan}
                  helperText={String(errors.greaterThan?.message || "")}
                  label="Must be greater than field name"
                  defaultValue={objRules?.greaterThan}
                ></TextField>
                <TextField
                  fullWidth
                  {...register("lessThan")}
                  error={!!errors.lessThan}
                  helperText={String(errors.lessThan?.message || "")}
                  label="Must be less than field name"
                  defaultValue={objRules?.lessThan}
                ></TextField>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  const handleCreateCover = (data: ICoverStructureField) => {
    data.coverStructureId = coverStructureId;
    let rule = {};
    if (data.type === "text") {
      rule = {
        isRequired: data.isRequired,
        matches: data.match,
        pattern: data.validationPattern,
        max: data.max,
        min: data.min,
      };
    }
    if (data.type === "date") {
      rule = {
        isRequired: data.isRequired,
        greaterThan: data.greaterThan,
        lessThan: data.lessThan,
      };
    }

    if (data.type === "number") {
      rule = {
        isRequired: data.isRequired,
        max: data.max,
        min: data.min,
        greaterThan: data.greaterThan,
        lessThan: data.lessThan,
        isPositiveNumber: data.isPositiveNumber,
      };
    }
    if (data.type === "expanded-text") {
      rule = {
        isRequired: data.isRequired,
        max: data.max,
        min: data.min,
      };
    }
    if (data.type === "options") {
      rule = {
        isRequired: data.isRequired,
      };
    }

    data.validationObject = JSON.stringify(rule);

    if (data.type !== "options") {
      data.defaultValue = "";
    }

    data.insuranceMainTypeId = coverStructureId;
    if (editStructureField) {
      data.id = editStructureField.id;
      data.url = isTemplate ? "/template/field" : "/CoverStructure/field/update";
      mutate({ ...data });
      return;
    }
    data.url = isTemplate ? "/template/field" : "/CoverStructure/field";

    //only valid when we are adding a template
    data.insuranceMainTypeId = coverStructureId;
    mutate({ ...data });
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onClose: (data) => handleCreateCover(data as ICoverStructureField),
        formContent: form,
        heading: "New Field",
        loading: isPending,
        maxWidth: "lg",
      })}

      <Button
        variant="text"
        startIcon={
          editStructureField ? <EditIcon color="success" /> : <AddIcon />
        }
        onClick={() => {
          dialog.open();
          reset();
        }}
      >
        {editStructureField ? "Edit" : "Field"}
      </Button>
    </div>
  );
};

export default AddCoverStructureFieldForm;

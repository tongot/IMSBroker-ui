"use client";
import useFormDialogContainer from "@/app/components/custom-components/FormDialogContainer";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import { queryClient } from "@/app/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import IHttpResponse from "@/app/utils/http/http-response";
import { AdjusterTypes, Operators } from "@/app/utils/interfaces/enums";
import ICoverStructureFieldRule from "@/app/utils/interfaces/cover-structure/cover-structure-field-rule";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface AddFieldRuleFormProp {
  rule?: ICoverStructureFieldRule;
  field: ICoverStructureField;
  refetchRule: () => void;
  isIcon?: boolean;
}
const AddFieldRuleForm = ({
  rule,
  refetchRule,
  field
}: AddFieldRuleFormProp) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();

  const dialog = useFormDialogContainer();

  const getOperators = (value: string) => {
    switch (value) {
      case "number":
        return Operators.filter(
          (item) => item.value !== "IN" && item.value !== "NOT-IN"
        );
      case "text":
        return Operators.filter(
          (item) => item.value === "==" || item.value === "!="
        );
      case "date":
        return Operators.filter(
          (item) => item.value !== "IN" && item.value !== "NOT-IN"
        );
      case "bool":
        return Operators.filter(
          (item) => item.value === "==" || item.value === "!="
        );
      case "options":
        return Operators.filter(
          (item) => item.value === "IN" || item.value === "NOT-IN"
        );
      default:
        return [];
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICoverStructureFieldRule) => POST(data, data.url),

    onSuccess: (data: IHttpResponse<ICoverStructureFieldRule>) => {
      queryClient.invalidateQueries({
        queryKey: ["underwriters-ins-rules" + field.id],
      });
      if (data.success) {
        refetchRule();
        notifications.show(
          `${rule ? "Updated" : "Added"} Field rule successful`,
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
        defaultValue={field.name}
        disabled
      ></TextField>

      {field.type !== "date" && field.type !== "bool" && (
        <TextField
          type={field.type === "number" ? "number" : "text"}
          {...register("value", { required: "Value is required" })}
          error={!!errors.hint}
          helperText={String(
            errors.hint?.message ||
              `${field.type === "options" ? "Add Comma separated values" : ""}`
          )}
          label="Value to compare against"
          defaultValue={rule?.value}
        ></TextField>
      )}

      {field.type === "date" && (
        <Controller
          name="value"
          control={control}
          rules={{ required: "Value is required" }}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Value"
              //value={ dayjs(rule?.value)}
              defaultValue={ dayjs(rule?.value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          )}
        />
      )}

      {field.type === "bool" && (
        <FormControl fullWidth>
          <InputLabel id="type-label">Value</InputLabel>
          <Select
            labelId="type-label-select-label"
            id="type-label-select"
            {...register("value", { required: "Value is required" })}
            error={!!errors.value}
            label="Value"
            defaultValue={rule?.value || "true"}
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl fullWidth>
        <InputLabel id="type-label">Operator</InputLabel>
        <Select
          labelId="type-label-select-label"
          id="type-label-select"
          {...register("operator", { required: "Operator is required" })}
          error={!!errors.operator}
          label="Operator"
          defaultValue={rule?.operator || "="}
        >
          {getOperators(field.type).map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.member}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="number"
        {...register("adjuster", { required: "Adjuster is required" })}
        error={!!errors.adjuster}
        helperText={String(errors.adjuster?.message || "")}
        label="Adjuster"
        defaultValue={rule?.adjuster.trim().replace("%", "")}
      ></TextField>

      <FormControl fullWidth>
        <InputLabel id="type-label">Adjustment Type</InputLabel>
        <Select
          labelId="type-label-select-label"
          id="type-label-select"
          {...register("adjustmentType", {
            required: "Adjustment Type is required",
          })}
          error={!!errors.adjustmentType}
          label="Adjustment Type"
          defaultValue={rule?.adjustmentType || "percentage"}
        >
          {AdjusterTypes.map((item) => (
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
              {...register("isActive")}
              defaultChecked={rule?.isActive}
            />
          }
          label="Active"
        />
      </FormGroup>
    </Box>
  );

  const handleFieldRule = (data: ICoverStructureFieldRule) => {
    data.coverStructureFieldId = field.id;
    data.fieldName = field.name;
    if (data.adjustmentType === "percentage") {
      data.adjuster = `${data.adjuster}%`;
    }
    if (rule) {
      data.id = rule.id;
      data.coverStructureFieldId = rule.coverStructureFieldId;
      data.url = "/CoverStructure/field/rules/update";
      mutate({ ...data });
      return;
    }
    data.url = "/CoverStructure/field/rules";
    mutate({ ...data });
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) => handleFieldRule(data as ICoverStructureFieldRule),
        formContent: form,
        heading: rule ? "Edit Rule" : "New Rule",
        loading: isPending,
      })}

      {rule ? (
        <IconButton
          size="small"
          onClick={() => {
            dialog.open();
            reset();
          }}
        >
          <EditIcon color="success" />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          startIcon={rule ? <EditIcon color="success" /> : <AddIcon />}
          onClick={() => {
            dialog.open();
            reset();
          }}
        >
          {rule ? "Edit" : "Field Rule"}
        </Button>
      )}
    </div>
  );
};

export default AddFieldRuleForm;

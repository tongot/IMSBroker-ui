"use client";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";
import Grid from "@mui/material/Grid2";
import { CoverStructureFieldDto, FieldOptionDto } from "@/app/api/ims-client";

interface FieldRenderProps {
  fields: CoverStructureFieldDto[];
  options: FieldOptionDto[];
  control: Control<FieldValues, any>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

export default function FieldRender({
  fields,
  options,
  control,
  errors,
}: FieldRenderProps) {
  const getOptions = (lookupTitle: string) => {
    return (
      options.find((option) => option.lookupType === lookupTitle)?.values || []
    );
  };

  return (
    <Grid container spacing={2}>
      {fields.map((fieldConfig, index) => {
        switch (fieldConfig.type) {
          case "options":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>{field.name}</InputLabel>
                      <Select
                        error={!!errors[field.name]}
                        {...field}
                        label={field.name}
                        value={field.value ?? fieldConfig.value}
                      >
                        {getOptions(fieldConfig.defaultValue || "")?.map(
                          (option: string) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            );
          case "date":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label={field.name}
                      value={
                        field.value
                          ? dayjs(field.value)
                          : fieldConfig.value
                            ? dayjs(fieldConfig.value)
                            : null
                      }
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors[field.name],
                          helperText: errors[field.name]
                            ? errors[field.name]?.message?.toString()
                            : "",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            );
          case "number":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={field.name}
                      fullWidth
                      defaultValue={fieldConfig.value ?? ""}
                      value={field.value ?? fieldConfig.value}
                      error={!!errors[field.name]}
                      helperText={
                        errors[field.name]
                          ? errors[field.name]?.message?.toString()
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
            );
          case "boolean":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value ?? fieldConfig.value}
                        />
                      }
                      label={field.name}
                    />
                  )}
                />
              </Grid>
            );
          case "bool":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value ?? fieldConfig.value}
                        />
                      }
                      label={field.name}
                    />
                  )}
                />
              </Grid>
            );
          case "text":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label={field.name}
                      fullWidth
                      value={field.value ?? fieldConfig.value}
                      error={!!errors[field.name]}
                      helperText={
                        errors[field.name]
                          ? errors[field.name]?.message?.toString() +
                            " " +
                            fieldConfig.hint
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
            );
          case "expanded-text":
            return (
              <Grid size={{ sm: 12, xs: 12, md: 6 }} key={index}>
                <Controller
                  name={fieldConfig.name || ""}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={field.name}
                      multiline
                      rows={4}
                      fullWidth
                      value={field.value ?? fieldConfig.value}
                      error={!!errors[field.name]}
                      helperText={
                        errors[field.name]
                          ? errors[field.name]?.message?.toString() +
                            " " +
                            fieldConfig.hint
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
            );
          default:
            return null;
        }
      })}
    </Grid>
  );
}

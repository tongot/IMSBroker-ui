"use client";

import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, MenuItem, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormContainer from "@/app/components/custom-components/FormContainer";

// Enum replacement
class Enums {
  constructor(
    public label: string,
    public value: string
  ) {}
}

const AdjusterTypes = [
  new Enums("Percentage", "percentage"),
  new Enums("Flat", "flat"),
];

const schema = yup.object().shape({
  adjustmentType: yup.string().required("Adjustment Type is required"),
  adjuster: yup
    .number()
    .typeError("Adjuster must be a number")
    .when("adjustmentType", {
      is: "percentage",
      then: (schema) =>
        schema
          .min(-100, "Minimum is -100 for percentage")
          .max(100, "Maximum is 100 for percentage")
          .required("Adjuster is required"),
      otherwise: (schema) => schema.required("Adjuster is required"),
    }),
});

interface OverrideRuleFormProps {
  currentAdjustmentType: string;
  currentAdjuster: string;
  onClose: () => void;
  isPending: boolean;
  handleOnSubmit: (data: any) => void;
}

const OverrideRuleForm = ({
  currentAdjuster,
  currentAdjustmentType,
  isPending,
  onClose,
  handleOnSubmit,
}: OverrideRuleFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      adjustmentType: currentAdjustmentType,
      adjuster: +currentAdjuster,
    },
  });

  const adjustmentType = useWatch({ control, name: "adjustmentType" });

  return (
    <Box>
      <FormContainer
        icon={<></>}
        heading={"Override Rule"}
        width={{ md: "100%" }}
        closeFn={onClose}
        action={handleSubmit((data) => handleOnSubmit(data))}
        loading={isPending}
        btnText="Override"
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="adjustmentType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adjustment Type"
                  select
                  fullWidth
                  error={!!errors.adjustmentType}
                  helperText={errors.adjustmentType?.message}
                >
                  {AdjusterTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="adjuster"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adjuster"
                  type="number"
                  fullWidth
                  error={!!errors.adjuster}
                  helperText={errors.adjuster?.message?.toString()}
                  inputProps={{
                    ...(adjustmentType === "percentage"
                      ? { min: -100, max: 100 }
                      : {}),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </FormContainer>
    </Box>
  );
};

export default OverrideRuleForm;

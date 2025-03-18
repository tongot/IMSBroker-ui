"use client";
import useFormDialogContainer from "@/app/components/FormDialogContainer";
import { useInsTypeStore } from "@/app/stores/lookup-store";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import IAddUnderwriterIns from "@/app/utils/interfaces/underwriters/add-underwrite-ins";
import { queryClient } from "@/app/components/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import IHttpResponse from "@/app/utils/http/http-response";
import IUnderwriterIns from "@/app/utils/interfaces/underwriters/underwriter-ins";

interface UnderwriterInsFormProps {
  editInsType?: IUnderwriterIns;
  underwriterId: number;
}
const UnderwriterInsForm = ({
  editInsType,
  underwriterId,
}: UnderwriterInsFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();
  const getInsType = useInsTypeStore((state) => state.getInsTypes);
  const loadingTypes = useInsTypeStore((state) => state.loadingInsType);
  const insTypes = useInsTypeStore((state) => state.insuranceTypes);

  const dialog = useFormDialogContainer();

  const commission = watch("commission");
  const vat = watch("vat");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IAddUnderwriterIns) => POST(data, data.url),

    onSuccess: (data: IHttpResponse<IUnderwriterIns>) => {
      queryClient.invalidateQueries({ queryKey: ["underwriters-ins"] });
      if (data.success) {
        notifications.show(
          `${editInsType ? "Updated" : "Added"} Insurance successful`,
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
  const handelTotalCommissionCalc = () => {
    if (!commission || !vat) {
      setValue("totalCommission", 0);
      return;
    }
    setValue("totalCommission", +commission + +vat);
    //setTotalCommission();
  };

  useEffect(() => {
    getInsType();
  }, [getInsType]);

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
        label="Total Commission(%)"
        disabled
        defaultValue={editInsType?.totalCommission}
        {...register("totalCommission")}
      ></TextField>
      {loadingTypes ? (
        <div>loading...</div>
      ) : (
        <FormControl fullWidth>
          <InputLabel id="ins-type-select-label">Insurance Type</InputLabel>
          <Select
            labelId="ins-type-select-label"
            id="ins-type-select"
            {...register("insuranceMainTypeId", {})}
            error={!!errors.insuranceMainTypeId}
            label="Insurance Type"
            defaultValue={
              editInsType?.insuranceMainTypeId || insTypes[0]?.id || 0
            }
          >
            {insTypes.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <TextField
        type="number"
        {...register("commission", {
          required: "Commission is required",
          max: { value: 100, message: "Commission must be less than 100" },
          min: { value: 0, message: "Commission must be greater than 0" },
        })}
        error={!!errors.commission}
        helperText={String(errors.commission?.message || "")}
        label="Commission(%)"
        defaultValue={editInsType?.commission}
        onBlur={() => handelTotalCommissionCalc()}
      ></TextField>

      <TextField
        type="number"
        {...register("vat", {
          required: "vat is required",
          max: { value: 100, message: "vat must be less than 100" },
          min: { value: 0, message: "vat must be greater than 0" },
        })}
        error={!!errors.vat}
        helperText={String(errors.vat?.message || "")}
        label="VAT(%)"
        defaultValue={editInsType?.vat}
        onBlur={() => handelTotalCommissionCalc()}
      ></TextField>
    </Box>
  );

  const handleCreateUnderwriterIns = (data: IAddUnderwriterIns) => {
    if (editInsType) {
      data.id = editInsType.id;
      data.underwriterId = underwriterId;
      data.url = "/underwriter/Underwriter-ins/update";
      mutate({ ...data });
      return;
    }
    data.underwriterId = underwriterId;
    data.url = "/underwriter/Underwriter-ins";
    mutate({ ...data });
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onClose: (data) =>
          handleCreateUnderwriterIns(data as IAddUnderwriterIns),
        formContent: form,
        heading: "New Underwriter Insurance",
        loading: isPending,
      })}

      <IconButton
        onClick={() => {
          dialog.open();
          reset();
        }}
      >
        {editInsType ? <EditIcon color="success" /> : <AddIcon />}
      </IconButton>
    </div>
  );
};

export default UnderwriterInsForm;

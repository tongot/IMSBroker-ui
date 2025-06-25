import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import useFormDialogContainer from "@/app/components/custom-components/FormDialogContainer";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { QuotationAddOnDto } from "@/app/api/ims-client";

interface AddOnProps {
  isLoading: boolean;
  data: string[];
  selectedAddOns: string[];
  handleAddAddOn: (addOn: QuotationAddOnDto) => void;
}
const QuotationAddOns = ({
  isLoading,
  data,
  handleAddAddOn,
  selectedAddOns,
}: AddOnProps) => {
  const addOnsDialog = useFormDialogContainer();

  const [excessAmount, setExcessAmount] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      amount: "",
      excess: "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (!value.amount || !value.excess) {
        setExcessAmount("");
        return;
      }
      if (+value.excess > +value.amount) {
        setExcessAmount("Excess must be less than amount");
      } else {
        setExcessAmount("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, excessAmount]);

  const handleCreateAddOn = (data: QuotationAddOnDto) => {
    reset({});
    handleAddAddOn(data);
    addOnsDialog.close();
    setExcessAmount("");
  };

  const handleOpen = () => {
    addOnsDialog.open();
    reset({});
    setExcessAmount("");
  };

  const form = (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {isLoading && <div>Loading...</div>}
      {data?.length > 0 && (
        <>
          {excessAmount && (
            <Alert icon={<WarningIcon fontSize="inherit" />} severity="error">
              {excessAmount}
            </Alert>
          )}
          <FormControl fullWidth>
            <InputLabel id="type-label">Add on name</InputLabel>
            <Select
              labelId="type-label-select-label"
              id="type-label-select"
              defaultValue=""
              {...register("name", {
                required: "Add on name is required",
              })}
              error={!!errors.name}
              label="Add on name"
            >
              <MenuItem value="">
                <em>Select an add-on</em>
              </MenuItem>
              {data
                .filter((x) => !selectedAddOns.includes(x))
                .map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            defaultValue=""
            {...register("amount", { required: "Amount is required" })}
            error={!!errors.amount}
            helperText={String(errors.amount?.message || "")}
          />

          <TextField
            fullWidth
            type="number"
            label="Excess"
            defaultValue=""
            {...register("excess", { required: "Excess is required" })}
            error={!!(errors.excess || excessAmount)}
            helperText={String(
              errors.excess?.message || "" || excessAmount ? excessAmount : ""
            )}
            sx={{ mb: 2 }}
          />
        </>
      )}
    </Box>
  );

  return (
    <div>
      {addOnsDialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreateAddOn(data as QuotationAddOnDto),
        formContent: form,
        heading: "Add Ons",
        loading: isLoading,
        btnIcon: <AddIcon />,
        btnText: "Add Addon",
        btnDisabled: !!excessAmount,
      })}
      <Button startIcon={<AddIcon />} onClick={handleOpen}>
        Add AddOns
      </Button>
    </div>
  );
};

export default QuotationAddOns;

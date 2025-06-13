import React from "react";
import AddIcon from "@mui/icons-material/Add";
import useFormDialogContainer from "@/app/components/FormDialogContainer";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { QuotationAddOnDto } from "@/app/api/ims-client";

interface AddOnProps {
  isLoading: boolean;
  data: string[];
  selectedAddOns: string[];
  handleAddOnChange?: (addOn: SelectChangeEvent<string[]>) => void;
  handleAddAddOn: (addOn: QuotationAddOnDto) => void;
}
const QuotationAddOns = ({
  isLoading,
  data,
  handleAddAddOn,
}: AddOnProps) => {
  const addOnsDialog = useFormDialogContainer();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

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
          <FormControl fullWidth>
            <InputLabel id="type-label">Add on name</InputLabel>
            <Select
              labelId="type-label-select-label"
              id="type-label-select"
              {...register("name", {
                required: "Add on name is required",
              })}
              error={!!errors.name}
              label="Add on name"
            >
              {data.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Amount"
            {...register("amount", { required: "Amount is required" })}
            error={!!errors.amount}
            helperText={String(errors.amount?.message || "")}
            sx={{ mb: 2 }}
          />
        </>
      )}
    </Box>
  );

  const handleCreateAddOn = (data: QuotationAddOnDto) => {
    handleAddAddOn(data);
  };

  return (
    <div>
      {addOnsDialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreateAddOn(data as QuotationAddOnDto),
        formContent: form,
        heading: "Add Ons",
        loading: isLoading,
      })}
       <Button startIcon={<AddIcon />}onClick={addOnsDialog.open}>Add AddOns</Button>
    </div>
  );
};

export default QuotationAddOns;

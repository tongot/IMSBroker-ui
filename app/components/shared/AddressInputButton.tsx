"use client";
import React from "react";
import useFormDialogContainer from "../FormDialogContainer";
import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useAddressStore } from "@/app/stores/contact-store";
import IAddAddress from "@/app/utils/interfaces/contact-information/address";
import Grid from "@mui/material/Grid2";
import { AddressType } from "@/app/utils/interfaces/enums";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'



interface AddressProps{
  address?:IAddAddress;
  entityId: number;
  entityType: string;
}
const AddressInputButton = ({address, entityId, entityType}:AddressProps) => {
  const dialog = useFormDialogContainer();
  const saveAddress = useAddressStore((state) => state.saveAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress)
  const loadingAddresses = useAddressStore((state) => state.loadingAddresses);

  const {
    register,
    handleSubmit,
    reset,
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
      <TextField
        type="text"
        {...register("city", {
          required: "City is required",
          minLength: {
            value: 2,
            message: "City must be at least 2 chars",
          },
        })}
        error={!!errors.city}
        helperText={String(errors.city?.message || "")}
        label="City"
        defaultValue={address?.city || ""}
      ></TextField>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 9, md: 9 }}>
          <TextField
            fullWidth
            {...register("street", {
              required: "Street is required",
              minLength: {
                value: 2,
                message: "Street must be at least 2 chars",
              },
            })}
            error={!!errors.street}
            helperText={String(errors.street?.message || "")}
            label="Street"
            defaultValue={address?.street || ""}
          ></TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <TextField
            fullWidth
            {...register("postalCode", {
              minLength: {
                value: 2,
                message: "Postal Code must be at least 2 chars",
              },
            })}
            error={!!errors.postalCode}
            helperText={String(errors.postalCode?.message || "")}
            label="Postal Code"
            defaultValue={address?.postalCode || ""}
          ></TextField>
        </Grid>
      </Grid>

      <TextField
        {...register("country", {
          minLength: {
            value: 2,
            message: "Country must be at least 2 chars",
          },
        })}
        error={!!errors.country}
        helperText={String(errors.country?.message || "")}
        label="Country"
        defaultValue={address?.country || ""}
      ></TextField>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Address Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          {...register("addressType", {})}
          error={!!errors.postalCode}
          label="Address Type"
          defaultValue={ address?.addressType || AddressType[0].value}
        >
          {AddressType.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.member}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const handleCreateAddress = (data: IAddAddress) => {
    data.addressType = Number(data.addressType);
    if(address){
      data.id = address.id;
      updateAddress(data, entityId, entityType);
      dialog.close(); 
      return
    }
    saveAddress(data, entityId, entityType);
    reset();
    dialog.close(); 
  };

  const openDialogAddAddress = () => {
       dialog.open();
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onClose: (data) => handleCreateAddress(data as IAddAddress),
        formContent: form,
        heading: "New underwriter Address",
        loading: loadingAddresses
      })}
     <IconButton
        onClick={openDialogAddAddress}
      >
         {address ?<EditIcon color="success"/>:<AddIcon/>}
      </IconButton> 
    </div>
  );
};

export default AddressInputButton;

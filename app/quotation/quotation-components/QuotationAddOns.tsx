import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import useFormDialogContainer from '@/app/components/FormDialogContainer';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import IAddOn from '@/app/utils/interfaces/quotation/add-ons';
import { GET } from '@/app/utils/http/GET';

const QuotationAddOns = () => {
    
  const addOnsDialog = useFormDialogContainer();

  const { data, isLoading } = useQuery({
    enabled: false,
    queryKey: ["Add-ons"],
    queryFn: () => GET<IAddOn[]>("/quotation/add-ons"), // Function to fetch data
  });
  
  const {
      register,
      handleSubmit,
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
       {data ? <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select add ons</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          {...register("id", {})}
          error={!!errors.postalCode}
          label="Select add ons"
          defaultValue={data[0].id}
        >
          {data.map((item) => (
            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
          ))}
        </Select>
      </FormControl>:
      <div>Loading...</div>
      } 
       
      <TextField

        type="number"
        {...register("value", {
          required: "Value is required",
          min: {
            value: 0,
            message: "Value must be 10 digits",
          },
        })}
        error={!!errors.mobileNumber}
        helperText={String(errors.value?.message || "")}
        label="Value"
        defaultValue=""
      ></TextField>
    </Box>
  );


  const handleCreateAddOn = (data:IAddOn) => {
        console.log(data)
  }

  return (
    <div>
        {addOnsDialog.render({
            handleSubmit,
            onClose: (data) => handleCreateAddOn(data as IAddOn),
            formContent: form,
            heading: "Add Ons",
            loading:isLoading
        })}
        <IconButton
            onClick={addOnsDialog.open}
        >
            {<AddIcon/>}
        </IconButton>
        </div>
  )
}

export default QuotationAddOns

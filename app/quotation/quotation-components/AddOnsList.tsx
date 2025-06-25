import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import React from "react";
import QuotationAddOns from "./QuotationAddOns";
import DeleteIcon from "@mui/icons-material/Delete";
import { QuotationAddOnDto } from "@/app/api/ims-client";
import { formatCurrency } from "@/app/utils/common-funcs";

interface AddOnsListProps {
  addOns: QuotationAddOnDto[];
  addOnsData: string[];
  addOnsIsLoading: boolean;
  selectedAddOns: string[];
  handleAddAddOn?: (addOn: QuotationAddOnDto) => void;
  setAddOns: (addOn: any) => void;
  setSelectedAddOns: (addOn: any) => void;
  customRemove?: (name: string) => void;
}

const AddOnsList = ({
  addOns,
  addOnsData,
  addOnsIsLoading,
  selectedAddOns,
  setSelectedAddOns,
  handleAddAddOn,
  setAddOns,
  customRemove,
}: AddOnsListProps) => {
  const handleRemoveAddOn = (name: string) => {
    setAddOns((prev: any) => prev.filter((x: any) => x.name !== name));
    setSelectedAddOns((prev: any) => prev.filter((x: string) => x !== name));
    if (customRemove) {
      customRemove(name);
    }
  };
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Chip
        sx={{ mb: 2 }}
        color="primary"
        variant="outlined"
        label={`Total AddOns: ${formatCurrency(addOns.reduce((x, y) => x + (y ? (y.amount ? +y.amount : 0) : 0), 0))}`}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          p: 2,
        }}
      >
        {handleAddAddOn && (
          <QuotationAddOns
            isLoading={addOnsIsLoading}
            data={addOnsData || []}
            selectedAddOns={selectedAddOns}
            handleAddAddOn={handleAddAddOn}
          />
        )}
      </Box>
      <Box>
        {addOns.map((addOn) => (
          <Paper
            key={addOn.name}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              p: 2,
              mb: 1,
            }}
          >
            <Typography variant="body1">{addOn.name}</Typography>
            <Typography variant="body1">
              Total: {formatCurrency(addOn.amount)}
            </Typography>
            <Typography variant="body1">
              Excess: {formatCurrency(addOn.excess)}
            </Typography>
            <IconButton onClick={() => handleRemoveAddOn(addOn?.name || "")}>
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};

export default AddOnsList;

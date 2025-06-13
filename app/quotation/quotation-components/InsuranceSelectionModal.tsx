import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import IInsuranceMainType from "@/app/utils/interfaces/lookups/insurance-main-types";


interface InsuranceSelectionModalProps {
  open: boolean;
  insTypes: IInsuranceMainType[];
  onClose: () => void;
  onContinue: (type: number, description: string) => void;
}

const InsuranceSelectionModal: React.FC<InsuranceSelectionModalProps> = ({
  open,
  insTypes,
  onClose,
  onContinue,
}) => {
  const theme = useTheme();
  const [insuranceType, setInsuranceType] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ type: false, description: false });

  const handleContinue = () => {
    const hasErrors = {
      type: !insuranceType,
      description: !description.trim(),
    };

    setErrors(hasErrors);

    if (!hasErrors.type && !hasErrors.description) {
      onContinue(insuranceType, description.trim());
      // Reset form
      setInsuranceType(0);
      setDescription("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10],
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6">Select Insurance Type</Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            select
            label="Insurance Type"
            value={insuranceType}
            onChange={(e) => setInsuranceType(+e.target.value)}
            error={errors.type}
            helperText={errors.type ? "Please select an insurance type" : ""}
            variant="outlined"
            fullWidth
            sx={{
              mt: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          >
            {insTypes?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            helperText={errors.description ? "Please enter a description" : ""}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            borderColor: theme.palette.divider,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InsuranceSelectionModal;

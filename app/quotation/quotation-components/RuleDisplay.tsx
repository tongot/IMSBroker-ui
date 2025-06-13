import { ApiResponseOfCoverStructureFieldRuleDto, CoverStructureFieldRuleDto, OverrideFieldRuleCommand } from "@/app/api/ims-client";
import {
  Box,
  Button,
  Chip,
  Dialog,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid2";
import OverrideRuleForm from "./OverrideRuleForm";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import { queryClient } from "@/app/components/Provider";
import { toast } from "react-toastify";

interface OperatorChipProps {
  operator: string;
}

const OperatorChip = ({ operator }: OperatorChipProps) => {
  const getColor = (op: string) => {
    switch (op) {
      case "==":
        return "success";
      case "!=":
        return "error";
      case "<":
        return "warning";
      case ">":
        return "warning";
      case "<=":
        return "warning";
      case ">=":
        return "warning";
      case "IN":
        return "info";
      case "NOT IN":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Chip
      label={operator}
      color={getColor(operator)}
      size="small"
      variant="outlined"
    />
  );
};


const getValueDisplay = (field: CoverStructureFieldRuleDto) => {
    return field.value || "";
};

interface RuleDisplayProps {
  rule: CoverStructureFieldRuleDto;
  quotationId: number;
  quotationFieldId: number;
  onToggleActive: (id: number, isActive: boolean) => void;
  loading: boolean;
}

const RuleDisplay = ({
  rule,
  quotationId,
  quotationFieldId,
    loading,
}: RuleDisplayProps) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const {mutate} = useMutation({
    mutationFn: (command: OverrideFieldRuleCommand) => POST(command, "/quotation/override-rule"),
    onSuccess: (data: ApiResponseOfCoverStructureFieldRuleDto) => {
        if (data.success) {
            queryClient.invalidateQueries({ queryKey: ["quotation-"+quotationId] });
            toast.success(data.message ||"Rule overridden successfully");
            setOpenDialog(false);
        } else {
            toast.error(data.message || "Failed to override rule");
        }
    },
    onError: (error) => {
      console.error("Error overriding rule:", error);
    },
  });

  
    const handleOnSubmit = (data: any) => {
       const adjustedData = new OverrideFieldRuleCommand({
          id: 0,
          quotationFieldId: quotationFieldId,
          adjustmentType: data.adjustmentType,
          adjuster: data.adjuster.toString(),
          coverStructureFieldRuleId: rule.id || 0,
          isAddingOverride: true,
          overrideRuleId: rule.overrideRuleId || 0,
       })
       mutate(adjustedData);
    };

    const handleRemoveOverride = () => {
        const adjustedData = new OverrideFieldRuleCommand({
          id: rule.id,
          quotationFieldId: quotationFieldId,
          adjustmentType: "",
          adjuster: "0",
          coverStructureFieldRuleId: rule.id || 0,
          isAddingOverride: false,
          overrideRuleId: rule.overrideRuleId || 0,
        });
        mutate(adjustedData);
    }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
        {loading && <Grid size={{ xs: 12 }}><Typography>updating...</Typography></Grid>}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {rule?.fieldName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <OperatorChip operator={rule?.operator || ""} />
            <Typography variant="body2">{getValueDisplay(rule)}</Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              {rule?.adjuster && (
                <>
                  <Typography variant="caption" color="text.secondary">
                    Adjustment
                  </Typography>
                  <Typography variant="body2">
                    {rule.adjuster} ({rule.adjustmentType})
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            override rule
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: "right" }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleRemoveOverride}
              fullWidth
              disabled={!rule.isOverride}
            >
              remove override
            </Button>
        </Grid>
      </Grid>

      <Dialog fullWidth maxWidth="sm" open={openDialog}>
        <OverrideRuleForm
          isPending={loading}
          handleOnSubmit={handleOnSubmit}
          onClose={() => setOpenDialog(false)}
          currentAdjuster={rule.adjuster?.replace("%", "") || "0"}
          currentAdjustmentType={rule.adjustmentType || "percentage"}
        />
      </Dialog>
    </Paper>
  );
};

export default RuleDisplay;

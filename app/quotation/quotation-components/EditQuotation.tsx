"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IGetQuotationDto } from "@/app/api/ims-client";
import IValidationProperties from "@/app/utils/interfaces/validation-properties";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import GenerateYupSchema from "@/app/utils/field-validator";
import GetFieldRules from "@/app/utils/field-rules";
import FieldRender from "@/app/components/shared/FieldRender";
import FormContainer from "@/app/components/FormContainer";
import RuleDisplay from "./RuleDisplay";
import { formatCurrency } from "@/app/utils/common-funcs";


interface EditQuotationProps {
  quotation: IGetQuotationDto;
  loading: boolean;
}

export default function EditQuotation({ quotation, loading}: EditQuotationProps) {
  const [comment, setComment] = useState<string>("");
  const [expandedField, setExpandedField] = useState<string | false>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [rules, setRules] = useState<IValidationProperties[]>();

  useEffect(() => {
    setRules(GetFieldRules(quotation.fieldsView?.categorisedFields));
  }, [quotation.fieldsView?.categorisedFields]);

  const handleOnSubmit = (data: any) => {
    // Handle form submission logic here
    console.log("Form submitted with data:", data);
  };

  //const ignoreRule = (id: number, isActive: boolean) => {};

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: rules ? yupResolver(GenerateYupSchema(rules)) : undefined,
  });

  const handleAccordionChange =
    (field: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedField(isExpanded ? field : false);
    };

  // const handleEditRule = (field: string): void => {
  //   //setEditDialog({ field, content: rulesByField[field]?.join("\n") || "" });
  // };

  return (
    <Box
      sx={{
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left Column */}
        <Paper
          elevation={0}
          sx={{
            flex: { xs: 1, md: 3 },
            overflow: "auto",
            p: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Card elevation={0} sx={{ mb: 2 }}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" gutterBottom>
                      Quotation #{quotation.qouteNumber}
                    </Typography>
                    <Chip label="Pending Approval" color="warning" />
                  </Stack>
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Underwriter:</strong>{" "}
                      {quotation.underwriter?.name}
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Typography>

                    <Typography variant="body2">
                      <strong>Client:</strong> {quotation.person?.firstName}{" "}
                      {quotation.person?.middleName}{" "}
                      {quotation.person?.lastName} (
                      {quotation.person?.identityNumber})
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.primary.light,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="primary.contrastText"
                        >
                          Base Premium
                        </Typography>
                        <Typography variant="h5" color="primary.contrastText">
                          {formatCurrency(quotation.initialBasePremiumAtPurchase)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.secondary.light,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="secondary.contrastText"
                        >
                          Final Premium
                        </Typography>
                        <Typography variant="h5" color="secondary.contrastText">
                          {formatCurrency(quotation.finalPremium)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Underwriter Commission
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2">
                        Total: {quotation.underwriterInsurance?.totalCommission}
                        %
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2">
                        Commission: {quotation.underwriterInsurance?.commission}
                        %
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2">
                        VAT: {quotation.underwriterInsurance?.vat}%
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Quotation Fields
                  </Typography>{" "}
                  <FormContainer
                    icon={<></>}
                    heading={"Quote Details"}
                    width={{ md: "100%" }}
                    closeFn={close}
                    action={handleSubmit((data) => handleOnSubmit(data))}
                    loading={false}
                    btnText="Generate Quote"
                  >
                    {quotation.fieldsView?.categorisedFields?.map(
                      (fieldCategory, index) => (
                        <Paper
                          variant="outlined"
                          elevation={0}
                          sx={{ p: 2, mt: 2 }}
                          key={index}
                        >
                          <Typography
                            sx={{ mb: 2 }}
                            variant="subtitle2"
                            gutterBottom
                          >
                            {fieldCategory.name}
                          </Typography>

                          <FieldRender
                            watch={watch}
                            options={quotation.fieldsView?.options || []}
                            errors={errors}
                            control={control}
                            fields={fieldCategory.fields || []}
                          />
                        </Paper>
                      )
                    )}
                  </FormContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Comment
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={() => {}}>
            Submit Quotation
          </Button>
        </Stack>
      </Paper>
        </Paper>

        {/* Right Column */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Premium Adjustment Rules
          </Typography>

          {quotation.fieldsView?.categorisedFields?.map((field) => {
            return (
              <Accordion
                key={field.name}
                expanded={expandedField === field.name}
                onChange={handleAccordionChange(field.name || "")}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>{field.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {field.fields?.map((f) =>
                    f.premiumCalcRule?.length === 0 ? (
                      <></>
                    ) : (
                      f.premiumCalcRule?.map((rule) => (
                        <RuleDisplay key={rule.id} loading={loading} quotationFieldId={f.quotationFieldId || 0}  quotationId={quotation.id||0} rule={rule} onToggleActive={()=>{}} />
                      ))
                    )
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Paper>
      </Box>
    </Box>
  );
}

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
  IconButton,
  Stack,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IGetQuotationDto, QuotationAddOnDto } from "@/app/api/ims-client";
import IValidationProperties from "@/app/utils/interfaces/validation-properties";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import GenerateYupSchema from "@/app/utils/field-validator";
import GetFieldRules from "@/app/utils/field-rules";
import FieldRender from "@/app/components/shared-button-components/FieldRender";
import FormContainer from "@/app/components/custom-components/FormContainer";
import { formatCurrency } from "@/app/utils/common-funcs";
import GenerateIcon from "@mui/icons-material/Refresh";
import QuotePremiumAdjustmentRules from "./QuotePremiumAdjustmentRules";
import { useAddOnForQuotes } from "@/app/utils/queries/add-ons";
import AddOnsList from "./AddOnsList";
import CustomPopOver from "@/app/components/custom-components/CustomPopOver";

interface EditQuotationProps {
  quotation: IGetQuotationDto;
  loading: boolean;
}

export default function EditQuotation({
  quotation,
  loading,
}: EditQuotationProps) {
  const [comment, setComment] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [rules, setRules] = useState<IValidationProperties[]>();
  const [addOnNames, setAddOnName] = useState<string[]>(
    quotation.quotationAddOns?.map((x) => x.name || "") || []
  );
  const [editQuotation, setEditQuotation] =
    useState<IGetQuotationDto>(quotation);

  const { data: addOnsData, isLoading: addOnsIsLoading } = useAddOnForQuotes(
    quotation.underwriterInsurance?.insuranceMainTypeId || 0,
    true,
    quotation.coverStructure?.id
  );

  useEffect(() => {
    setRules(GetFieldRules(quotation.fieldsView?.categorisedFields));
  }, [quotation.fieldsView?.categorisedFields]);

  const handleOnSubmit = (data: any) => {
    console.log(data);
  };

  const handleAddAddOn = (data: QuotationAddOnDto) => {
    const addOn: QuotationAddOnDto = new QuotationAddOnDto({
      id: data.id,
      name: data.name,
      amount: data.amount,
      rate: 0,
      note: "",
    });
    setAddOnName((prev) => [...prev, data?.name || ""]);

    setEditQuotation((prev) => ({
      ...prev,
      quotationAddOns: [...(prev.quotationAddOns || []), addOn],
    }));
  };

  const handleRemoveAddOn = (name: string) => {
    setEditQuotation((prev) => ({
      ...prev,
      quotationAddOns: [
        ...(prev.quotationAddOns?.filter((x) => x.name !== name) || []),
      ],
    }));

    setAddOnName((prev: any) => prev.filter((x: string) => x !== name));
  };

  // const onPremiumUpdate = (data:any)=>{

  //   setEditQuotation(prev =>({
  //     ...prev,

  //   }))
  // }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: rules ? yupResolver(GenerateYupSchema(rules)) : undefined,
  });

  const {
    handleSubmit: handleSubmitNewBasePremium,
    formState: { errors: newBasePremiumError },
    register,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const onChangeRate = (rate: number) => {
    const basePremium = (rate / 100) * +getValues("amountInsured");
    setValue("basePremium", basePremium);
  };

  const onChangeAmountInsured = (amountInsured: number) => {
    const basePremium = (getValues("rate") / 100) * amountInsured;
    setValue("basePremium", basePremium);
  };

  const onChangeBasePrem = (basePremium: number) => {
    const rate = (basePremium / getValues("amountInsured")) * 100;
    setValue("rate", rate);
  };

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
                      Quotation #{editQuotation.qouteNumber}
                    </Typography>
                    <Chip label="Pending Approval" color="warning" />
                  </Stack>
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Underwriter:</strong>{" "}
                      {editQuotation.underwriter?.name}
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Typography>

                    <Typography variant="body2">
                      <strong>Client:</strong> {editQuotation.person?.firstName}{" "}
                      {editQuotation.person?.middleName}{" "}
                      {editQuotation.person?.lastName} (
                      {editQuotation.person?.identityNumber})
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
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="primary.contrastText"
                          >
                            Base Premium
                          </Typography>
                          <Chip
                            size="small"
                            label={`@ ${quotation.coverStructure?.rate}% of ${formatCurrency(quotation.amountInsured)}`}
                            color="info"
                            onClick={() => {}}
                          />

                          <CustomPopOver
                            tooltipText="Override Base Premium"
                            controlType="button"
                            btnVariant="contained"
                            size="small"
                            btnColor="error"
                            btnContent={"edit"}
                            canCloseOnClick={false}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                width: "300px",
                                flexDirection: "column",
                                gap: 1,
                                p: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                color="secondary.contrastText"
                              >
                                Override Base Premium
                              </Typography>
                              <TextField
                                label="Amount Insured/Assured"
                                type="number"
                                defaultValue={quotation.amountInsured || ""}
                                helperText={String(
                                  newBasePremiumError.amountInsured?.message ||
                                    ""
                                )}
                                error={!!newBasePremiumError.amountInsured}
                                {...register("amountInsured", {
                                  required: "Amount Insured is required",
                                  min: {
                                    value: 0,
                                    message:
                                      "Amount Insured greater than zero(0)",
                                  },
                                  onChange: (e) =>
                                    onChangeAmountInsured(e.target.value),
                                })}
                              ></TextField>
                              <TextField
                                label="Rate%"
                                type="number"
                                defaultValue={
                                  quotation.coverStructure?.rate || ""
                                }
                                helperText={String(
                                  newBasePremiumError.rate?.message || ""
                                )}
                                error={!!newBasePremiumError.rate}
                                {...register("rate", {
                                  required: "Rate is required",
                                  min: {
                                    value: 0,
                                    message: "Rate be greater than zero(0)",
                                  },
                                  max: {
                                    value: 100,
                                    message: "Rate be less than or equal 100",
                                  },
                                  onChange: (e) => onChangeRate(e.target.value),
                                })}
                              ></TextField>
                              <TextField
                                label="Base Premium"
                                type="number"
                                defaultValue={
                                  quotation.initialBasePremiumAtPurchase || ""
                                }
                                helperText={String(
                                  newBasePremiumError.basePremium?.message || ""
                                )}
                                error={!!newBasePremiumError.basePremium}
                                {...register("basePremium", {
                                  required: "New base premium is required",
                                  min: {
                                    value: 0,
                                    message:
                                      "Premium must be greater than zero(0)",
                                  },
                                  onChange: (e) =>
                                    onChangeBasePrem(e.target.value),
                                })}
                              ></TextField>
                              <TextField
                                multiline
                                label="Comment"
                                rows={3}
                                helperText={String(
                                  newBasePremiumError.comment?.message || ""
                                )}
                                error={!!newBasePremiumError.comment}
                                {...register("comment", {
                                  required: "Comment is required",
                                  maxLength: {
                                    value: 500,
                                    message:
                                      "Comment must be less than 500 characters",
                                  },
                                  minLength: {
                                    value: 2,
                                    message:
                                      "Comment must be at least 2 characters",
                                  },
                                })}
                              ></TextField>
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={handleSubmitNewBasePremium((data) => {
                                  console.log(data);
                                })}
                              >
                                Ok
                              </Button>
                            </Box>
                          </CustomPopOver>
                        </Box>
                        <Typography variant="h5" color="primary.contrastText">
                          {formatCurrency(
                            editQuotation.initialBasePremiumAtPurchase
                          )}
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
                          {formatCurrency(editQuotation.finalPremium)}
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
                        Total:{" "}
                        {editQuotation.underwriterInsurance?.totalCommission}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2">
                        Commission:{" "}
                        {editQuotation.underwriterInsurance?.commission}%
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="body2">
                        VAT: {editQuotation.underwriterInsurance?.vat}%
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <FormContainer
                    icon={<></>}
                    heading={"Quote Details"}
                    width={{ md: "100%" }}
                    closeFn={close}
                    action={handleSubmit((data) => handleOnSubmit(data))}
                    loading={false}
                    btnText="Recalculate Quote"
                    loadingBtnText="Recalculating..."
                    btnIcon={<GenerateIcon />}
                  >
                    {editQuotation.fieldsView?.categorisedFields?.map(
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
                            options={editQuotation.fieldsView?.options || []}
                            errors={errors}
                            control={control}
                            fields={fieldCategory.fields || []}
                          />
                        </Paper>
                      )
                    )}
                    <AddOnsList
                      addOns={editQuotation.quotationAddOns || []}
                      addOnsData={addOnsData || []}
                      addOnsIsLoading={addOnsIsLoading}
                      selectedAddOns={addOnNames}
                      setAddOns={handleRemoveAddOn}
                      setSelectedAddOns={setAddOnName}
                      handleAddAddOn={handleAddAddOn}
                      customRemove={handleRemoveAddOn}
                    />
                  </FormContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Divider />
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
          <QuotePremiumAdjustmentRules
            quotation={editQuotation}
            loading={loading}
          />
        </Paper>
      </Box>
    </Box>
  );
}

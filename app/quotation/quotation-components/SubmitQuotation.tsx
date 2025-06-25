"use client";
import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Alert } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import IValidationProperties from "@/app/utils/interfaces/validation-properties";
import { GET } from "@/app/utils/http/GET";
import { useMutation, useQuery } from "@tanstack/react-query";
import GenerateYupSchema from "@/app/utils/field-validator";
import FieldRender from "@/app/components/shared-button-components/FieldRender";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import FormContainer from "@/app/components/custom-components/FormContainer";
import IHttpResponse from "@/app/utils/http/http-response";
import { queryClient } from "@/app/Provider";
import POST from "@/app/utils/http/POST";
import { useNotifications } from "@toolpad/core/useNotifications";
import dayjs from "dayjs";
import ViewQuoteModal from "./ViewQuoteModal";
import GenerateIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";

import {
  CoverStructureFieldDto,
  CreateQuotationRespDto,
  FieldsViewDto,
  GetQuotationChoiceDto,
  GetQuotationDto,
  IGetQuotationChoiceDto,
  InsuranceMainType,
  ISaveQuotationCommand,
  QuotationAddOnDto,
  QuotationFieldDto,
  QuotationViewDto,
} from "@/app/api/ims-client";
import IMSModal from "@/app/components/custom-components/IMSModal";
import ConflictQuoteConfirm from "./ConflictQuoteConfirm";
import GetFieldRules from "@/app/utils/field-rules";
import AddOnsList from "./AddOnsList";
import { useAddOnForQuotes } from "@/app/utils/queries/add-ons";
import { useRouter } from "next/navigation";

interface SubmitQuotationProps {
  insTypes: InsuranceMainType[];
  category: number;
  quoteDescription: string;
  setAddOns: React.Dispatch<React.SetStateAction<QuotationAddOnDto[]>>;
  addOns: QuotationAddOnDto[];
  setSelectedQuote: React.Dispatch<
    React.SetStateAction<QuotationViewDto | null>
  >;
  selectedQuote: QuotationViewDto | null;
}

const SubmitQuotation = ({
  insTypes,
  category,
  quoteDescription,
  setAddOns,
  addOns,
  setSelectedQuote,
  selectedQuote,
}: SubmitQuotationProps) => {
  const [rules, setRules] = useState<IValidationProperties[]>();
  const [addOnNames, setAddOnName] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<QuotationViewDto[]>([]);

  const [quoteDetails, setQuoteDetails] = useState<GetQuotationDto | null>(
    null
  );
  const [excessAmount, setExcessAmount] = useState("");
  const [createQuoteResponse, setCreateQuoteResponse] =
    useState<CreateQuotationRespDto>();
  const [modalOpen, setModalOpen] = useState(false);
  const [openConflictModal, setOpenConflictModal] = useState(false);
  const notifications = useNotifications();
  const router = useRouter();

  const { mutate: saveQuotation, isPending: isSavePending } = useMutation({
    mutationFn: (quoteRequest: ISaveQuotationCommand) =>
      POST(quoteRequest, "/Quotation/create-quotation"),

    onSuccess: (data: IHttpResponse<CreateQuotationRespDto>) => {
      queryClient.invalidateQueries({
        queryKey: ["create quotation"],
      });
      setModalOpen(false);
      if (data.success) {
        notifications.show(`Quote successful`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        router.push(`/quotation/${data.data.quotationId}`);
      } else {
        notifications.show(data.message, {
          severity: "warning",
          autoHideDuration: 10000,
        });
        if (data.data.conflictingQuoteId) {
          setCreateQuoteResponse(data.data);
          setOpenConflictModal(true);
        }
      }
    },
    onError: (e) => {
      console.error(e);
      notifications.show("Failed please try again later or report issue", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const handleSaveQuote = (personId: number) => {
    if (quoteDetails && selectedQuote) {
      const quotation = {
        personId: personId,
        quoteVariables: quoteDetails,
        quote: selectedQuote,
      };
      //setQuoteToSave(quotation);
      saveQuotation(quotation);
      setOpenConflictModal(false);
    }
  };

  const { data, isLoading, refetch } = useQuery({
    enabled: false,
    queryKey: ["Quotation-new"],
    queryFn: () => GET<FieldsViewDto>("/quotation/GetQuoteFields/" + category), // Function to fetch data
  });

  const {
    data: addOnsData,
    isLoading: addOnsIsLoading,
    refetch: addOnsRefetch,
  } = useAddOnForQuotes(category, false);

  const { mutate, isPending } = useMutation({
    mutationFn: (quoteRequest: IGetQuotationChoiceDto) =>
      POST(quoteRequest, "/policy/GetQuote"),

    onSuccess: (data: IHttpResponse<QuotationViewDto[]>) => {
      queryClient.invalidateQueries({
        queryKey: ["quotation request"],
      });
      if (data.success) {
        notifications.show(`Quote successful`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        setQuotes(data.data);
        setSelectedQuote(data.data[0] || null);
        setModalOpen(true);
      } else {
        notifications.show(data.message, {
          severity: "warning",
          autoHideDuration: 10000,
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

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: rules ? yupResolver(GenerateYupSchema(rules)) : undefined,
  });

  useEffect(() => {
    let listOfRules: IValidationProperties[] = [];
    if (data) {
      listOfRules = GetFieldRules(data.categorisedFields || []);

      //add rules to base value form fields
      if (insTypes.find((x) => x.id === category)?.name === "Non-Motor") {
        listOfRules.push({
          name: "sumInsured",
          isRequired: true,
          isPositiveNumber: true,
          type: "number",
        });
      }
      if (insTypes.find((x) => x.id === category)?.name === "Motor") {
        listOfRules.push({
          name: "insurableValue",
          isRequired: true,
          isPositiveNumber: true,
          type: "number",
        });
      }
      if (insTypes.find((x) => x.id === category)?.name === "Life") {
        listOfRules.push({
          name: "sumAssured",
          isRequired: true,
          isPositiveNumber: true,
          type: "number",
        });
      }
      if (insTypes.find((x) => x.id === category)?.name === "Health") {
        listOfRules.push({
          name: "expectedMedicalCost",
          isRequired: true,
          isPositiveNumber: true,
          type: "number",
        });
        listOfRules.push({
          name: "riskLoading",
          isRequired: true,
          isPositiveNumber: true,
          type: "number",
        });
      }
    }
    setRules(listOfRules);

    if (category > 0) {
      refetch();
      addOnsRefetch();
    }
  }, [category, data]);

  const handleOnSubmit = (formData: any) => {
    console.log("Form Data: ", formData);
    const fields: QuotationFieldDto[] = [];
    let allFields: CoverStructureFieldDto[] = [];

    data?.categorisedFields?.forEach((x) => {
      allFields = [...allFields, ...(x.fields || [])];
    });

    Object.keys(formData).forEach((x) => {
      const field = allFields.find((f) => f.name == x);
      if (
        field &&
        formData[x] &&
        ![
          "sumAssured",
          "sumInsured",
          "insurableValue",
          "riskLoading",
          "expectedMedicalCost",
        ].includes(x)
      ) {
        let stringValue = "";
        if (field.type == "date") {
          stringValue = dayjs(formData[x]).format("YYYY-MM-DD").toString();
        } else {
          stringValue = formData[x].toString();
        }
        fields.push(
          new QuotationFieldDto({
            name: x,
            fieldValue: stringValue,
            coverStructureFieldId: field.id,
            type: field.type,
            subHeading: "",
            rules: "",
          })
        );
      }
    });

    const quoteRequest: GetQuotationChoiceDto = new GetQuotationChoiceDto({
      insuranceType: insTypes.find((x) => x.id === category)?.name || "",
      sumAssured: formData.sumAssured,
      sumInsured: formData.sumInsured,
      insurableValue: formData.insurableValue,
      insuranceTypeId: category,
      riskLoading: formData.riskLoading,
      expectedMedicalCost: formData.expectedMedicalCost,
      excess: formData.excess,
      fields: fields,
      addOns: addOns,
    });
    setQuoteDetails(quoteRequest);
    mutate(quoteRequest);
  };

  const getAmountField = (value: any) => {
    if (value.sumInsured) {
      return value.sumInsured;
    } else if (value.sumAssured) {
      return value.sumAssured;
    } else if (value.insurableValue) {
      return value.insurableValue;
    } else if (value.expectedMedicalCost) {
      return value.expectedMedicalCost;
    }
    return undefined;
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (!getAmountField(value) || !value.excess) {
        setExcessAmount("");
        return;
      }
      if (+value.excess > +getAmountField(value)) {
        setExcessAmount("Excess must be less than base amount");
      } else {
        setExcessAmount("");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, excessAmount]);

  let fieldContent = null;
  if (isLoading) {
    fieldContent = <div>Loading...</div>;
  }
  if (data) {
    fieldContent = (
      <div>
        {excessAmount && (
          <Alert icon={<WarningIcon fontSize="inherit" />} severity="error">
            {excessAmount}
          </Alert>
        )}
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Base value
          </Typography>
          {insTypes.find((x) => x.id === category)?.name === "Non-Motor" && (
            <Controller
              name="sumInsured"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Sum Insured"
                  fullWidth
                  value={field.value ?? ""}
                  error={!!errors[field.name]}
                  helperText={
                    errors[field.name]
                      ? errors[field.name]?.message?.toString()
                      : ""
                  }
                />
              )}
            />
          )}

          {insTypes.find((x) => x.id === category)?.name === "Life" && (
            <Controller
              name="sumAssured"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Sum Assured"
                  fullWidth
                  value={field.value ?? ""}
                  error={!!errors[field.name]}
                  helperText={
                    errors[field.name]
                      ? errors[field.name]?.message?.toString()
                      : ""
                  }
                />
              )}
            />
          )}

          {insTypes.find((x) => x.id === category)?.name === "Motor" && (
            <Controller
              name="insurableValue"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Insurable Value"
                  fullWidth
                  value={field.value ?? ""}
                  error={!!errors[field.name]}
                  helperText={
                    errors[field.name]
                      ? errors[field.name]?.message?.toString()
                      : ""
                  }
                />
              )}
            />
          )}

          {insTypes.find((x) => x.id === category)?.name === "Health" && (
            <>
              {" "}
              <Controller
                name="expectedMedicalCost"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Expected Medical Cost"
                    fullWidth
                    value={field.value ?? ""}
                    error={!!errors[field.name]}
                    helperText={
                      errors[field.name]
                        ? errors[field.name]?.message?.toString()
                        : ""
                    }
                  />
                )}
              />
              <Controller
                name="riskLoading"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Risk Loading"
                    fullWidth
                    value={field.value ?? ""}
                    error={!!errors[field.name]}
                    helperText={
                      errors[field.name]
                        ? errors[field.name]?.message?.toString()
                        : ""
                    }
                  />
                )}
              />
            </>
          )}
        </Paper>

        {insTypes.find((x) => x.id === category)?.hasExcess && (
          <Paper elevation={0} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Excess value
            </Typography>
            <Controller
              name="excess"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Excess"
                  fullWidth
                  value={field.value ?? ""}
                  error={!!errors[field.name]}
                  helperText={
                    errors[field.name]
                      ? errors[field.name]?.message?.toString()
                      : ""
                  }
                />
              )}
            />
          </Paper>
        )}

        {data.categorisedFields?.map((fieldCategory, index) => (
          <Paper elevation={0} sx={{ p: 2, mt: 2 }} key={index}>
            <Typography variant="h6" gutterBottom>
              {fieldCategory.name}
            </Typography>
            <FieldRender
              watch={watch}
              options={data.options || []}
              errors={errors}
              control={control}
              fields={fieldCategory.fields || []}
            />
          </Paper>
        ))}
      </div>
    );
  }

  const handleAddAddOn = (data: QuotationAddOnDto) => {
    const addOn: QuotationAddOnDto = new QuotationAddOnDto({
      id: data.id,
      name: data.name,
      amount: data.amount,
      excess: data.excess,
      rate: 0,
      note: "",
    });
    setAddOns((prev) => [...prev, addOn]);
    setAddOnName((prev) => [...prev, data?.name || ""]);
  };

  const icon = <RequestQuoteIcon sx={{ fontSize: 25 }} />;

  return (
    <>
      <div>
        <Paper sx={{ mb: 2 }} elevation={0}>
          <FormContainer
            icon={icon}
            heading={`New ${insTypes.find((x) => x.id === category)?.name || ""} Quotation  (${quoteDescription})`}
            width={{ md: "100%" }}
            action={handleSubmit((data) => handleOnSubmit(data))}
            loading={isPending}
            btnIcon={<GenerateIcon />}
            btnText="Generate Quote"
            loadingBtnText="Calculating"
            disableSubmit={!!excessAmount}
          >
            <>
              {fieldContent}

              <AddOnsList
                addOns={addOns}
                addOnsData={addOnsData || []}
                addOnsIsLoading={addOnsIsLoading}
                selectedAddOns={addOnNames}
                setAddOns={setAddOns}
                setSelectedAddOns={setAddOnName}
                handleAddAddOn={handleAddAddOn}
              />
              <IMSModal
                openDialog={modalOpen}
                heading="Select Best Quotation"
                maxWidth="md"
                onClose={() => setModalOpen(false)}
              >
                <ViewQuoteModal
                  onConfirmSelection={handleSaveQuote}
                  quotes={quotes}
                  onSelect={(quote) => setSelectedQuote(quote)}
                  loading={isSavePending}
                />
              </IMSModal>
            </>
          </FormContainer>
        </Paper>
      </div>
      <IMSModal
        openDialog={openConflictModal}
        heading="Select Quote"
        maxWidth="md"
        onClose={() => setOpenConflictModal(false)}
      >
        <ConflictQuoteConfirm
          loading={isSavePending}
          onIgnoreConflict={handleSaveQuote}
          data={createQuoteResponse || new CreateQuotationRespDto()}
        />
      </IMSModal>
    </>
  );
};

export default SubmitQuotation;

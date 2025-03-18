"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useInsTypeStore } from "@/app/stores/lookup-store";
import IValidationProperties from "@/app/utils/interfaces/validation-properties";
import IFieldView from "@/app/utils/interfaces/cover-structure/fields-view";
import { GET } from "@/app/utils/http/GET";
import { useMutation, useQuery } from "@tanstack/react-query";
import GenerateYupSchema from "@/app/utils/field-validator";
import FieldRender from "@/app/components/shared/FieldRender";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import FormContainer from "@/app/components/FormContainer";
import IPolicyField from "@/app/utils/interfaces/policy/policy-field";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import IQuotationView from "@/app/utils/interfaces/quotation/quotation-view";
import IHttpResponse from "@/app/utils/http/http-response";
import { queryClient } from "@/app/components/Provider";
import POST from "@/app/utils/http/POST";
import { useNotifications } from "@toolpad/core/useNotifications";
import dayjs from "dayjs";
import IGetQuotation from "@/app/utils/interfaces/quotation/get-quotation";
import QuotationAddOns from "./QuotationAddOns";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const SubmitQuotation = () => {
  const [category, setCategory] = useState<number>(0);

  const getInsType = useInsTypeStore((state) => state.getInsTypes);
  const loadingTypes = useInsTypeStore((state) => state.loadingInsType);
  const insTypes = useInsTypeStore((state) => state.insuranceTypes);
  const [rules, setRules] = useState<IValidationProperties[]>();
  const notifications = useNotifications();

  const { data, isLoading, refetch } = useQuery({
    enabled: false,
    queryKey: ["Quotation-new"],
    queryFn: () => GET<IFieldView>("/quotation/GetQuoteFields/" + category), // Function to fetch data
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (quoteRequest: IGetQuotation) =>
      POST(quoteRequest, quoteRequest.url),

    onSuccess: (data: IHttpResponse<IQuotationView>) => {
      queryClient.invalidateQueries({
        queryKey: ["quotation request"],
      });
      if (data.success) {
        console.log(data.data);
        notifications.show(`Quote successful`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        //reset();
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
    const listOfRules: IValidationProperties[] = [];
    if (data) {
      data.categorisedFields.forEach((x) => {
        x.fields.forEach((r) => {
          if (r.validationObject) {
            const rule: IValidationProperties = JSON.parse(r.validationObject);
            rule.name = r.name;
            rule.type = r.type;

            listOfRules.push(rule);
          }
        });
      });

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

    if (category > 0) refetch();
    getInsType();
  }, [getInsType, category, data]);

  const handleOnSubmit = (formData: any) => {
    const fields: IPolicyField[] = [];
    let allFields: ICoverStructureField[] = [];

    data?.categorisedFields.forEach((x) => {
      allFields = [...allFields, ...x.fields];
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
        fields.push({
          name: x,
          fieldValue: stringValue,
          coverStructureFieldId: field.id,
          type: field.type,
        });
      }
    });

    const quoteRequest: IGetQuotation = {
      insuranceType: insTypes.find((x) => x.id === category)?.name || "",
      url: "/policy/GetQuote",
      sumAssured: formData.sumAssured,
      sumInsured: formData.sumInsured,
      insurableValue: formData.insurableValue,
      riskLoading: formData.riskLoading,
      expectedMedicalCost: formData.expectedMedicalCost,
      fields: fields,
    };
    mutate(quoteRequest);
  };

  let fieldContent = null;
  if (isLoading) {
    fieldContent = <div>Loading...</div>;
  }
  if (data) {
    fieldContent = (
      <div>
        {insTypes && (
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
        )}
        {data.categorisedFields.map((fieldCategory, index) => (
          <Paper elevation={0} sx={{ p: 2, mt: 2 }} key={index}>
            <Typography variant="h6" gutterBottom>
              {fieldCategory.name}
            </Typography>
            <FieldRender
              watch={watch}
              options={data.options}
              errors={errors}
              control={control}
              fields={fieldCategory.fields}
            />
          </Paper>
        ))}
      </div>
    );
  }

  const close = () => {};
  const icon = <RequestQuoteIcon sx={{ fontSize: 25 }} />;

  return (
    <div>
      {loadingTypes ? (
        <div>loading...</div>
      ) : (
        <div>
          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel id="ins-type-select-label">Insurance Type</InputLabel>
            <Select
              labelId="ins-type-select-label"
              id="ins-type-select"
              label="Insurance Type"
              value={category ?? ""}
              onChange={(e) => setCategory(+e.target.value)}
            >
              {insTypes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <Paper elevation={0}>
        <FormContainer
          icon={icon}
          heading="New Quotation"
          width={{ md: "100%" }}
          closeFn={close}
          action={handleSubmit((data) => handleOnSubmit(data))}
          loading={isPending}
          btnText="Generate Quote"
        >
          {fieldContent}
        </FormContainer>
      </Paper>
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography
            sx={{
              display: "flex",
            }}
            variant="h6"
          >
            <AddCircleOutlineIcon />
            Add Ons
          </Typography>
          <QuotationAddOns />
        </Box>
      </Paper>
    </div>
  );
};

export default SubmitQuotation;

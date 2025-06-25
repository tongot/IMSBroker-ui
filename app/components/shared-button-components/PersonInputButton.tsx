"use client";
import React, { useEffect, useState } from "react";
import useFormDialogContainer from "../custom-components/FormDialogContainer";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IPerson from "@/app/utils/interfaces/person/add-person";
import { useLookupStore } from "@/app/stores/lookup-store";
import Grid from "@mui/material/Grid2";
import Contact from "./Contact";
import Address from "./Address";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../Provider";
import POST from "@/app/utils/http/POST";
import { useNotifications } from "@toolpad/core/useNotifications";
import IHttpResponse from "@/app/utils/http/http-response";

interface PersonProps {
  personData?: IPerson;
}

const PersonInputButton = ({ personData }: PersonProps) => {
  const dialog = useFormDialogContainer();
  const getLookupFor = useLookupStore((state) => state.getLookupFor);
  const getLookup = useLookupStore((state) => state.getLookUp);
  const loadingLookup = useLookupStore((state) => state.loadingLookup);
  const [person, setPerson] = useState(personData);
  
  const notifications = useNotifications();

  const {mutate, isPending} = useMutation({
    mutationFn: (data:IPerson) => POST(data, data.url),
    onSuccess: (data:IHttpResponse<IPerson>) => {
      queryClient.invalidateQueries({ queryKey: ["person"] });
      notifications.show("Done", {
        severity: "success",
        autoHideDuration: 3000,
      });
      setPerson(data.data);
      reset();
    },
    onError: () => {
      notifications.show("Failed please try again later or report issue", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
    });

  useEffect(() => {
    const fetchData = async () => {
      await getLookupFor(
        "Gender,MaritalStatus,Race,Title,Occupation,Nationality,IdentityType"
      );
    };
    fetchData();
  }, [getLookupFor]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const form = (
    <Grid container spacing={1}>
      <Grid size={{ sm: 12, xs: 12, md: 6 }}>
        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Grid container spacing={1}>
            <Grid size={{ sm: 12, xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="titleId-select-label">Title</InputLabel>
                <Select
                  labelId="titleId-select-label"
                  id="titleId-select"
                  {...register("titleId", {
                    required: true,
                  })}
                  error={!!errors.titleId}
                  label="Identity Doc Type"
                  defaultValue={person?.titleId || ""}
                >
                  <MenuItem key={0} value=""></MenuItem>
                  {getLookup("Title").map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, xs: 12, md: 9 }}>
              <TextField
                fullWidth
                type="text"
                {...register("firstName", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 chars",
                  },
                })}
                error={!!errors.firstName}
                helperText={String(errors.firstName?.message || "")}
                label="First Name"
                defaultValue={person?.firstName || ""}
              ></TextField>
            </Grid>
          </Grid>
          <Controller
          name="dateOfBirth"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Date of birth"
              defaultValue={ dayjs(person?.dateOfBirth)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          )}
        />
          <Grid container spacing={1}>
            <Grid size={{ sm: 12, xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="text"
                {...register("middleName", {
                  minLength: {
                    value: 2,
                    message: "Middle Name must be at least 2 chars",
                  },
                })}
                error={!!errors.middleName}
                helperText={String(errors.middleName?.message || "")}
                label="Middle Name"
                defaultValue={person?.middleName || ""}
              ></TextField>
            </Grid>
            <Grid size={{ sm: 12, xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="text"
                {...register("lastName", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 chars",
                  },
                })}
                error={!!errors.lastName}
                helperText={String(errors.lastName?.message || "")}
                label="Last Name"
                defaultValue={person?.lastName || ""}
              ></TextField>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid size={{ sm: 12, xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="doc-type-identity-select-label">
                  Identity Doc Type
                </InputLabel>
                <Select
                  labelId="doc-type-identity-select-label"
                  id="doc-type-identity-select"
                  {...register("identityTypeId", {
                    required: true,
                  })}
                  error={!!errors.identityTypeId}
                  label="Identity Doc Type"
                  defaultValue={person?.identityTypeId || ""}
                >
                  <MenuItem key={0} value=""></MenuItem>
                  {getLookup("IdentityType").map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, xs: 12, md: 8 }}>
              <TextField
                fullWidth
                {...register("identityNumber", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "ID must be at least 2 chars",
                  },
                })}
                error={!!errors.identityNumber}
                helperText={String(errors.identityNumber?.message || "")}
                label="ID Number"
                defaultValue={person?.identityNumber || ""}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={{ sm: 12, xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="gender-select-label">Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  id="gender-select"
                  {...register("genderId", { required: true })}
                  error={!!errors.genderId}
                  label="Gender"
                  defaultValue={person?.genderId || ""}
                >
                  <MenuItem key={0} value=""></MenuItem>
                  {getLookup("Gender").map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="maritalStatusId-select-label">
                  Marital Status
                </InputLabel>
                <Select
                  labelId="maritalStatusId-select-label"
                  id="maritalStatusId-select"
                  {...register("maritalStatusId", { required: true })}
                  error={!!errors.maritalStatusId}
                  label="Marital Status"
                  defaultValue={person?.maritalStatusId || ""}
                >
                  <MenuItem key={0} value=""></MenuItem>
                  {getLookup("MaritalStatus").map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ sm: 12, xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="raceId-select-label">
                  Race
                </InputLabel>
                <Select
                  labelId="raceId-select-label"
                  id="raceId-select"
                  {...register("raceId", { required: true })}
                  error={!!errors.raceId}
                  label="Race"
                  defaultValue={person?.raceId || ""}
                >
                  <MenuItem key={0} value=""></MenuItem>
                  {getLookup("Race").map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <FormControl fullWidth>
              <InputLabel id="occupationId-select-label">Occupation</InputLabel>
              <Select
                labelId="occupationId-select-label"
                id="occupationId-select"
                {...register("occupationId", { required: true })}
                error={!!errors.occupationId}
                label="Occupation"
                defaultValue={person?.occupationId || ""}
              >
                <MenuItem key={0} value=""></MenuItem>
                {getLookup("Occupation").map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="nationalityId-select-label">
                  Nationality
                </InputLabel>
                <Select
                  labelId="nationalityId-select-label"
                  id="nationalityId-select"
                  {...register("nationalityId", { required: true })}
                  error={!!errors.nationalityId}
                  label="Nationality"
                  defaultValue={person?.nationalityId || ""}
                >
                  <MenuItem key={0} value=""></MenuItem>
                  {getLookup("Nationality").map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Grid>
        </Box>
      </Grid>
      <Grid size={{ sm: 12, xs: 12, md: 6 }}>
        {person ? <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Contact
              entityId={person?.id || 0}
              entityType={"Person"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Address
              entityId={person?.id || 0}
              entityType={"Person"}
            />
          </Grid>
        </Grid> :
        <div>
            <h4>Add new person, their contacts will come here</h4>
        </div> }
      </Grid>
    </Grid>
  );

  const handleCreatePerson = (data: IPerson) => {
    if (person) {
      data.id = person.id;
      data.url = "/people/update";
      mutate(data);
      return;
    }
    data.url = "/people";
    mutate(data);
  };

  const openDialogAddPerson = () => {
      dialog.open();
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onSubmit: (data) => handleCreatePerson(data as IPerson),
        formContent: form,
        heading: "New Person",
        loading: loadingLookup || isPending,
        maxWidth: "xl",
      })}
      <IconButton onClick={openDialogAddPerson}>
        {person ? <EditIcon color="success" /> : <AddIcon />}
      </IconButton>
    </div>
  );
};

export default PersonInputButton;

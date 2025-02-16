"use client";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FormContainer from "@/app/components/FormContainer";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid2";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/http/POST";
import { queryClient } from "@/app/components/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import Address from "@/app/components/shared/Address";
import Contact from "@/app/components/shared/Contact";
import { UnderwriterStatus } from "@/app/interfaces/enums";
import UnderwriterIns from "../underwriter-components/UnderwriterIns";
import IAddUnderwriter from "@/app/interfaces/underwriters/underwriter-add";

interface AddUnderwriterFormProps {
  editUnderwriter?: IAddUnderwriter;
}
const AddUnderwriterForm: React.FC<AddUnderwriterFormProps> = ({
  editUnderwriter,
}) => {
  const router = useRouter();
  const notifications = useNotifications();

  const {
    register: registerUnd,
    handleSubmit: handleSubmitUnd,
    formState: { errors: errorsUnd },
  } = useForm({ mode: "onChange" });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IAddUnderwriter) => POST(data),

    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["underwriters"] });
      notifications.show("Done", {
        severity: "success",
        autoHideDuration: 3000,
      });
      if (!editUnderwriter) {
        router.push(`/underwriters/${id}`);
      }
    },
    onError: () => {
      notifications.show("Failed please try again later or report issue", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const handleSubmitUnderwriter = (name: string, status: string) => {
    console.log(name, status);
    const statusValue = Number(status);

    console.log(name, statusValue);
    if (editUnderwriter) {
      mutate({
        id: editUnderwriter.id,
        name: name,
        status: statusValue,
        contact: [],
        address: [],
        url: "/underwriter/update",
      });
      return;
    }
    mutate({
      id: 0,
      name: name,
      status: statusValue,
      contact: [],
      address: [],
      url: "/underwriter",
    });
  };

  const width = { xs: "100%", sm: "100%", md: "100%" };
  const formUnderwriter = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        gap: "1rem",
      }}
    >
      <TextField
        {...registerUnd("name", {
          required: "Name is required",
          minLength: {
            value: 3,
            message: "Name must at least 3 chars",
          },
        })}
        error={!!errorsUnd.name}
        helperText={String(errorsUnd.name?.message || "")}
        name="name"
        label="Underwriter name"
        defaultValue={editUnderwriter?.name}
      ></TextField>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          {...registerUnd("status", {})}
          error={!!errorsUnd.postalCode}
          label="Status"
          defaultValue={editUnderwriter?.status || UnderwriterStatus[0].value}
        >
          {UnderwriterStatus.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.member}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const close = () => {
    router.push("/underwriters");
  };

  return (
    <div>
      <Paper sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <FormContainer
                icon={<CorporateFareIcon sx={{ fontSize: 34 }} />}
                heading={
                  editUnderwriter
                    ? `Edit underwriter ${editUnderwriter.name}`
                    : "New underwriter"
                }
                width={width}
                closeFn={close}
                action={handleSubmitUnd((data) =>
                  handleSubmitUnderwriter(data.name, data.status)
                )}
                loading={isPending}
              >
                {formUnderwriter}
              </FormContainer>
          </Grid>
          {editUnderwriter && (
            <Grid size={{ xs: 12, sm: 12, md: 8 }}>
              <Paper sx={{ padding: 3 }}>
                <UnderwriterIns underwriterId={editUnderwriter.id || 0} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>

      {editUnderwriter && (
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ padding: 5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Contact
                  entityId={editUnderwriter?.id || 0}
                  entityType={"Underwriter"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Address
                  entityId={editUnderwriter?.id || 0}
                  entityType={"Underwriter"}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </div>
  );
};

export default AddUnderwriterForm;

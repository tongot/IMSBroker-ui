"use client";
import { Box, Paper, TextField } from "@mui/material";
import React from "react";
import AccountCircleRound from "@mui/icons-material/AccountCircleRounded";
import FormContainer from "@/app/components/custom-components/FormContainer";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import POST from "@/app/utils/http/POST";
import IAddUser from "@/app/utils/interfaces/users/add-user";
import { queryClient } from "@/app/Provider";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useRouter } from "next/navigation";

const NewUserPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const notifications = useNotifications();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IAddUser) => POST(data, data.url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notifications.show("User created successfully", {
        severity: "success",
        autoHideDuration: 3000,
      });
    },
    onError: () => {
      notifications.show("Failed to create user", {
        severity: "error",
        autoHideDuration: 3000,
      });
    },
  });

  const handleCreateUser = (data: { email: string; password: string }) => {
    mutate({
      userName: data.email,
      password: data.password,
      url: "/user/create-user",
    });
  };

  const width = { xs: "100%", sm: "48%", md: "30%" };
  const widthForm = {xs: "100%", sm: "100%", md: "100%"};

  const icon = <AccountCircleRound sx={{ fontSize: 34 }} />;
  const closeUrl = "/users";

  const close = () =>{
    router.push(closeUrl)
  }

  const form = (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email is not valid",
          },
        })}
        error={!!errors.email}
        helperText={String(errors.email?.message || "")}
        name="email"
        label="Email"
      ></TextField>
      <TextField
        type="password"
        {...register("password", {
          required: "Password is required",
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: "Password is not valid",
          },
        })}
        error={!!errors.password}
        helperText={String(errors.password?.message || "")}
        label="Password"
      ></TextField>
    </Box>
  );

  return (
    <Paper sx={{width:width, display:'flex', flexDirection:'column'}}>
      <FormContainer
        icon={icon}
        heading="New User"
        width={widthForm}
        closeFn={close}
        action={handleSubmit((data) =>
          handleCreateUser({ email: data.email, password: data.password })
        )}
        loading={isPending}
      >
        {form}
      </FormContainer>
    </Paper>
  );
};

export default NewUserPage;

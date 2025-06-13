"use client";
import useFormDialogContainer from "@/app/components/FormDialogContainer";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Avatar,
  Chip,
  InputLabel, // Added for proper label handling
  FormControl,
  Button, // Added for proper form structure
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { ICoverState } from "@/app/utils/interfaces/state-machine/cover-state";
import LookUpUserButton from "@/app/components/shared/LookUpUserButton";
import IUser from "@/app/utils/interfaces/users/user";
import { useUserStore } from "@/app/stores/user-store";
import { IAddCoverState } from "@/app/utils/interfaces/state-machine/add-cover-state";

interface AddCoverStateProps {
  coverState?: ICoverState;
  coverId: number;
  onSubmit: (data: IAddCoverState) => void;
  loading: boolean;
}

const AddCoverStateForm = ({
  onSubmit,
  coverId,
  loading,
  coverState,
}: AddCoverStateProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [currentUsers, setCurrentUsers] = useState<IUser[]>([]);
  const selectedUsers = useUserStore((state) => state.selectedUsers);
  const setSelectedUsers = useUserStore((state) => state.presetSelectedUsers);
  const removeSelectedUsers = useUserStore((state) => state.selectOrRemoveUser);

  useEffect(() => {
    if (coverState) {
      const users: IUser[] = coverState.users.map((user) => ({
        id: user.userId,
        userName: user.userName || "",
        email: user.userName || "",
        roles: [],
        password: "",
        isSelected: true,
      }));
      setCurrentUsers(users);
    }

    const unsubscribeUserStore = useUserStore.subscribe(({ selectedUsers }) => {
      setCurrentUsers(selectedUsers);
    });

    return () => {
      unsubscribeUserStore();
    };
  }, [coverState, selectedUsers]);

  const dialog = useFormDialogContainer();

  const form = (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        maxHeight: "80vh",
        overflow: "hidden",
      }}
    >
      {/* Left Panel - Form Fields */}
      <Paper
        sx={{
          p: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          overflow: "auto",
          minHeight: { xs: "auto", md: "100%" },
          borderRight: { md: "1px solid rgba(0, 0, 0, 0.12)" },
          borderRadius: { md: "8px 0 0 8px" },
          boxShadow: "none",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}
        >
          Cover State Details
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="name-field">
                Name
              </InputLabel>
              <TextField
                id="name-field"
                fullWidth
                defaultValue={coverState?.name}
                size="small"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={String(errors.name?.message || "")}
                variant="outlined"
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="order-field">
                Order
              </InputLabel>
              <TextField
                id="order-field"
                fullWidth
                type="number"
                defaultValue={coverState?.order}
                size="small"
                {...register("order", {
                  required: "Order is required",
                  valueAsNumber: true,
                })}
                error={!!errors.order}
                helperText={String(errors.order?.message || "")}
                variant="outlined"
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 1,
                backgroundColor: "action.hover",
                borderRadius: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...register("isActiveState")}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={<Typography variant="body2">Is Active State</Typography>}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...register("isFinalState")}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={<Typography variant="body2">Is Final State</Typography>}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...register("isInitialState")}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2">Is Initial State</Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...register("requireUnderwriterApprovals")}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2">
                    Require Underwriter Approvals
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    defaultChecked
                    {...register("isActive")}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={<Typography variant="body2">Is Active</Typography>}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Right Panel - Users List */}
      <Paper
        sx={{
          p: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: { xs: "auto", md: "100%" },
          borderRadius: { md: "0 8px 8px 0" },
          boxShadow: "none",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, color: "text.primary" }}
          >
            Assigned Users
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {selectedUsers.length > 0 && (
              <Chip
                label={`${selectedUsers.length} selected`}
                size="small"
                color="primary"
                sx={{ height: 24 }}
              />
            )}
            <LookUpUserButton />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {selectedUsers.length > 0 ? (
          <List
            sx={{
              overflow: "auto",
              flex: 1,
              py: 0,
              "& .MuiListItem-root": {
                px: 1,
                py: 1,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              },
            }}
          >
            {selectedUsers.map((user) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => removeSelectedUsers(user)}
                    color="error"
                    sx={{
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 2,
                    fontSize: 14,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  {user.userName.charAt(0).toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {user.userName}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "text.secondary",
              gap: 1,
              p: 4,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <PersonOutlineIcon fontSize="large" sx={{ opacity: 0.5 }} />
            <Typography variant="body2">
              No users assigned to this state
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );

  const handleCreateCoverState = (data: IAddCoverState) => {
    data.userIds = selectedUsers.map((user) => user.id);

    if (coverState) {
      data.id = coverState.id;
    }

    data.coverStructureId = coverId;
    onSubmit(data);
  };

  return (
    <div>
      {dialog.render({
        handleSubmit,
        onClose: () => {
          setSelectedUsers([]);
          dialog.close();
        },
        onSubmit: (data) => handleCreateCoverState(data as IAddCoverState),
        formContent: form,
        heading: coverState ? "Edit Cover State" : "New Cover State",
        loading: loading,
      })}

      {coverState ? (
        <IconButton
          onClick={() => {
            dialog.open();
            setSelectedUsers(currentUsers);
            reset();
          }}
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <EditIcon color="primary" fontSize="small" />
        </IconButton>
      ) : (
        <Button
        startIcon={<AddIcon color="primary" />}
        variant="text"
        onClick={() => {
          dialog.open();
          setSelectedUsers(currentUsers);
          reset();
        }}
        sx={{
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        Add State
      </Button>
      )}
    </div>
  );
};

export default AddCoverStateForm;

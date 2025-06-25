"use client";
import React, { useEffect, useCallback } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Grid, // Import Grid from stable MUI
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import IMSModal from "../custom-components/IMSModal";
import { useUserStore } from "@/app/stores/user-store";
import IUser from "@/app/utils/interfaces/users/user";

const LookUpUserButton = () => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [searchedUsers, setSearchedUsers] = React.useState<IUser[]>([]);

  const searchedUserState = useUserStore((state) => state.userList);
  const searchUser = useUserStore((state) => state.searchUser);
  const loadingUser = useUserStore((state) => state.loadingUser);
  const selectOrRemoveUser = useUserStore((state) => state.selectOrRemoveUser);
  const selectedUsers = useUserStore((state) => state.selectedUsers);
  const clearUserList = useUserStore((state) => state.clearUserList);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
    clearUserList();
    setSearchText("");
  }, [clearUserList]);

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      searchUser(searchText);
    }
  }, [searchText, searchUser]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchedUsers(searchedUserState);
  }, [searchedUserState]);

  const form = (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h2" gutterBottom>
            Search Users
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Find and select users by name or username
          </Typography>
        </Grid>
        
        <Grid container item xs={12} spacing={1} alignItems="center">
          <Grid item xs>
            <TextField
              name="name"
              label="Search user"
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: searchText && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchText("")}
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs="auto">
            <Button
              variant="contained"
              disabled={!searchText.trim()}
              onClick={handleSearch}
              startIcon={loadingUser ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ height: '40px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            maxHeight: "400px",
            overflowY: "auto",
            bgcolor: 'background.paper'
          }}>
            {searchedUsers.length > 0 ? (
              <List dense>
                {searchedUsers.map((user) => (
                  <ListItem
                    key={user.id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => selectOrRemoveUser(user)}
                        checked={user.isSelected}
                        color="primary"
                      />
                    }
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: 'divider',
                      "&:hover": { bgcolor: "action.hover" },
                      "&:last-child": { borderBottom: "none" },
                    }}
                    onClick={() => selectOrRemoveUser(user)}
                  >
                    <ListItemText 
                      primary={user.userName} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                      secondary={user.email || 'No email provided'}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 100,
                color: 'text.secondary'
              }}>
                {loadingUser ? (
                  <CircularProgress size={24} />
                ) : (
                  <Typography variant="body2">
                    {searchText ? 'No users found' : 'Enter search terms to find users'}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleClose}
            disabled={loadingUser}
            sx={{ minWidth: 120 }}
          >
            Done ({selectedUsers.length} selected)
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={() => setOpenDialog(true)}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
        }}
      >
        Add Users
      </Button>
      
      <IMSModal
        heading="User Selection"
        maxWidth="sm"
        onClose={handleClose}
        openDialog={openDialog}
      >
        {form}
      </IMSModal>
    </>
  );
};

export default LookUpUserButton;
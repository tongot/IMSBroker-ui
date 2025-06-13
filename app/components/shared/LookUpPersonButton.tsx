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
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import IMSModal from "../IMSModal";
import { usePeopleStore } from "@/app/stores/people-store";
import { IGetPersonDto } from "@/app/api/ims-client";
import Grid from "@mui/material/Grid2";

const LookUpPersonButton = () => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [searchedPeople, setSearchedPeople] = React.useState<IGetPersonDto[]>([]);

  const searchedPeopleState = usePeopleStore((state) => state.peopleList);
  const searchPeople = usePeopleStore((state) => state.searchPeople);
  const loadingPeople = usePeopleStore((state) => state.loadingPeople);
  const selectOrRemovePeople = usePeopleStore((state) => state.selectOrRemovePeople);
  const selectedPeople = usePeopleStore((state) => state.selectedPeople);
  const clearPeopleList = usePeopleStore((state) => state.clearPeopleList);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
    clearPeopleList();
    setSearchText("");
  }, [clearPeopleList]);

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      searchPeople(searchText);
    }
  }, [searchText, searchPeople]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchedPeople(searchedPeopleState);
  }, [searchedPeopleState]);

  const form = (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* <Grid size={{xs:12}}>
          <Typography variant="h6" component="h2" gutterBottom>
            Search Person
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Find and select people by name or identity number
          </Typography>
        </Grid> */}
        
        <Grid container size={{xs:12}} spacing={1} alignItems="center">
          <Grid size={{xs:9}}>
            <TextField
              name="name"
              label="Search person"
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyPress}
              slotProps={{
                input: {
                  endAdornment: searchText && (
                    <IconButton
                      size="small"
                      onClick={() => setSearchText("")}
                      edge="end"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{xs:3}}>
            <Button
              fullWidth
              variant="contained"
              disabled={!searchText.trim()}
              onClick={handleSearch}
              startIcon={loadingPeople ? <CircularProgress size={20} /> : <SearchIcon />}
              sx={{ height: '40px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Grid size={{xs:12}}>
          <Box sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            maxHeight: "400px",
            overflowY: "auto",
            bgcolor: 'background.paper'
          }}>
            {searchedPeople.length > 0 ? (
              <List dense>
                {searchedPeople.map((person) => (
                  <ListItem
                    key={person.id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => selectOrRemovePeople(person)}
                        checked={person.isSelected}
                        color="primary"
                      />
                    }
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: 'divider',
                      "&:hover": { bgcolor: "action.hover" },
                      "&:last-child": { borderBottom: "none" },
                    }}
                    onClick={() => selectOrRemovePeople(person)}
                  >
                    <ListItemText 
                      primary={ 
                      <Typography variant="subtitle1" color="text.secondary">
                        {person.lastName || person.firstName}
                      </Typography>} 
                      secondary={person.identityNumber || 'No id provided'}
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
                {loadingPeople ? (
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

        <Grid size={{xs:12}} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleClose}
            disabled={loadingPeople}
            sx={{ minWidth: 120 }}
          >
            Done ({selectedPeople.length} selected)
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
        Select Person
      </Button>
      
      <IMSModal
        heading="Search and Select People"
        maxWidth="sm"
        onClose={handleClose}
        openDialog={openDialog}
      >
        {form}
      </IMSModal>
    </>
  );
};

export default LookUpPersonButton;
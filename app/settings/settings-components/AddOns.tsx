import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, TextField, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AddOnsInputButton from "@/app/components/shared-button-components/AddOnsInputButton";
import { useAddonsQuery } from "@/app/utils/queries/add-ons";


const AddOns: React.FC = () => {

  const [searchString, setSearchString] = useState<string>('');

  const { data, isLoading } = useAddonsQuery();

  const handleSearch = (stringSearch: string) => {
    setSearchString(stringSearch);
  }


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add-Ons Management
      </Typography>

      <Grid container spacing={3}>
        {/* Add-On List */}
        <Grid  size={{xs:12, md:6}}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Current Add-Ons</Typography>
              <AddOnsInputButton/>
            </Box>
            <TextField
              label="Add-On Name"
              fullWidth
              value={searchString}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ mt: 2 }}
            />
            {isLoading && <div>Loading...</div>}
            {data && <List  sx={{ maxHeight: "400px", overflowY: "auto" }}>
              {data.filter(x => x.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())).map((addOn) => (
                <ListItem key={addOn.id} sx={{ borderBottom: "1px solid #eee", "&:hover": { bgcolor: "action.hover" },cursor: "pointer"}}>
                  <ListItemText primary={`${addOn.name} | ${addOn.insuranceTypeName}`} secondary={`Rate: ${addOn.rate + "%" || "N/A"}`} />
                  <AddOnsInputButton editAddOn={addOn}/>
                </ListItem>
              ))}
            </List>}
          </Paper>
        </Grid>

        {/* Add New Add-On */}
        <Grid size={{xs:12, md:6}}>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddOns;

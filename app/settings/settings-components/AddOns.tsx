import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, TextField, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useQuery } from "@tanstack/react-query";
import IDefaultAddOn from "@/app/utils/interfaces/cover-structure/add-on";
import { GET } from "@/app/utils/http/GET";
import AddOnsInputButton from "@/app/components/shared/AddOnsInputButton";


const AddOns: React.FC = () => {

  const [searchString, setSearchString] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ["addons"], // Unique key for caching
    queryFn: () => GET<IDefaultAddOn[]>("/addons"), // Function to fetch data
  });

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

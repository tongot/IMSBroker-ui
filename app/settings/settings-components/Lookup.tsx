import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LookupInputButton from "@/app/components/shared-button-components/LookupInputButton";
import { useQuery } from "@tanstack/react-query";
import ILookupType from "@/app/utils/interfaces/lookups/Iookup-type";
import { GET } from "@/app/utils/http/GET";
import { useLookupStore } from "@/app/stores/lookup-store";
import LookupTypeButton from "@/app/components/shared-button-components/LookupTypeButton";


const LookupsDisplay: React.FC = () => {
  
  const [selectedCategory, setSelectedCategory] = useState<ILookupType | null>(null);
  const [categorySearchString, setCategorySearchString] = useState("");
  const [lookupSearchString, setLookupSearchString] = useState("");


  const getLookupsFor = useLookupStore((state) => state.getLookupFor);
  const lookups = useLookupStore((state) => state.lookupData);
  const loadingLookup = useLookupStore((state) => state.loadingLookup);

  const { data, isLoading } = useQuery({
    queryKey: ["lookup-categories"], // Unique key for caching
    queryFn: () => GET<ILookupType[]>("/lookup/categories"), // Function to fetch data
  });


  const handleFilterCategory = (searchString: string) => {
    setCategorySearchString(searchString);
}

  const handleCategorySelect = (category: ILookupType) => {
    getLookupsFor(category.name);
    setSelectedCategory(category);
  };

  const handleSearchLookup = (searchString: string) => {
    setLookupSearchString(searchString);
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lookups Management
      </Typography>

      <Grid container spacing={3}>
        {/* Categories Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Categories</Typography>
              <LookupTypeButton/>
            </Box>
            <TextField
              label="Search Category"
              fullWidth
              value={categorySearchString}
              onChange={(e) => handleFilterCategory(e.target.value)}
              sx={{ mt: 2 }}
            />
            {data && (
              <List sx={{ maxHeight: "400px", overflowY: "auto" }}>
                {data.filter((x) =>
              x.name
                .toLocaleLowerCase()
                .includes(categorySearchString.toLocaleLowerCase())).map((category) => (
                  <ListItem
                    key={category.id}
                    component="div"
                    sx={{
                      cursor: "pointer",
                      bgcolor:
                        selectedCategory?.name === category.name
                          ? "action.selected"
                          : "inherit",
                      borderBottom: "1px solid #eee",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <ListItemText
                      primary={category.name}
                      secondary={category.description}
                    />
                    <LookupTypeButton editType={category}/>
                  </ListItem>
                ))}
              </List>
            )}
            {isLoading && <div>Loading...</div>}
          </Paper>
        </Grid>

        {/* Items Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 2 }}>
            {selectedCategory ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">{selectedCategory?.name} </Typography>
                  {selectedCategory && <LookupInputButton lookupTypes={selectedCategory.name} lookupTypeId={selectedCategory.id} />}
                </Box>

                {loadingLookup && <div>Loading...</div>}
                <TextField
                  label={`Add Item to ${selectedCategory?.name}`}
                  fullWidth
                  value={lookupSearchString}
                  onChange={(e) => handleSearchLookup(e.target.value)}
                  sx={{ mt: 2 }}
                />
                {lookups && (
                  <List  sx={{ maxHeight: "400px", overflowY: "auto" }}>
                    {lookups.filter(x =>
                      x.name.toLocaleLowerCase()
                      .includes(lookupSearchString.toLocaleLowerCase())).map((item) => (
                      <ListItem
                        key={item.id}
                        sx={{ borderBottom: "1px solid #eee" }}
                      >
                        <ListItemText primary={item.name} />
                        <LookupInputButton lookupTypes={selectedCategory.name} lookupTypeId={selectedCategory.id} 
                        editLookup={{id: item.id, name:item.name, description:item.description, url:'', lookupTypeId:selectedCategory.id}}/>
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            ) : (
              <Typography>Select a category to manage items</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LookupsDisplay;

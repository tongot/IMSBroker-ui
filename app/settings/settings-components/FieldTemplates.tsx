import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/app/utils/http/GET";
import { useInsTypeStore } from "@/app/stores/lookup-store";
import LookupTypeButton from "@/app/components/shared-button-components/LookupTypeButton";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import AddCoverStructureFieldForm from "@/app/underwriters/underwriter-components/AddCoverStructureFieldForm";
import { InsuranceMainType } from "@/app/api/ims-client";

const FieldTemplates: React.FC = () => {
  const [selectedInsurance, setSelectedInsurance] =
    useState<InsuranceMainType | null>(null);
  const [fieldSearchString, setFieldSearchString] = useState("");

  const getIns = useInsTypeStore((state) => state.getInsTypes);
  const insuranceTypes = useInsTypeStore((state) => state.insuranceTypes);
  const loadingIns = useInsTypeStore((state) => state.loadingInsType);

  const { data, isLoading, refetch } = useQuery({
    enabled: false,
    queryKey: ["field-template" + selectedInsurance?.id], // Unique key for caching
    queryFn: () =>
      GET<ICoverStructureField[]>("/template/" + selectedInsurance?.id), // Function to fetch data
  });

  useEffect(() => {
    getIns();
    if (selectedInsurance) {
      refetch();
    }
  }, [selectedInsurance]);

  const handleFilterField = (searchString: string) => {
    setFieldSearchString(searchString);
  };

  const handleSelectInsurance = (ins: InsuranceMainType) => {
    setSelectedInsurance(ins);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Fields Management
      </Typography>

      <Grid container spacing={3}>
        {/* Categories Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Insurance Type</Typography>
              <LookupTypeButton />
            </Box>
            {insuranceTypes && (
              <List sx={{ maxHeight: "400px", overflowY: "auto" }}>
                {insuranceTypes.map((category) => (
                  <ListItem
                    key={category.id}
                    component="div"
                    sx={{
                      cursor: "pointer",
                      bgcolor:
                        selectedInsurance?.id === category.id
                          ? "action.selected"
                          : "inherit",
                      borderBottom: "1px solid #eee",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => handleSelectInsurance(category)}
                  >
                    <ListItemText primary={category.name} />
                  </ListItem>
                ))}
              </List>
            )}
            {loadingIns && <div>Loading...</div>}
          </Paper>
        </Grid>

        {/* Items Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 2 }}>
            {selectedInsurance ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">
                    {selectedInsurance?.name}{" "}
                  </Typography>
                  {selectedInsurance && (
                    <AddCoverStructureFieldForm
                      isTemplate={true}
                      coverStructureId={selectedInsurance.id || 0}
                      refetchField={refetch}
                    />
                  )}
                </Box>

                {isLoading && <div>Loading...</div>}
                <TextField
                  label={`Search Field Name`}
                  fullWidth
                  value={fieldSearchString}
                  onChange={(e) => handleFilterField(e.target.value)}
                  sx={{ mt: 2 }}
                />
                {data && (
                  <List sx={{ maxHeight: "400px", overflowY: "auto" }}>
                    {data
                      .filter((x) =>
                        x.name
                          .toLocaleLowerCase()
                          .includes(fieldSearchString.toLocaleLowerCase())
                      )
                      .map((item) => (
                        <ListItem
                          key={item.id}
                          sx={{ borderBottom: "1px solid #eee" }}
                        >
                          <ListItemText
                            primary={item.name}
                            secondary={"Type: " + item.type}
                          />
                          <AddCoverStructureFieldForm
                            editStructureField={item}
                            isTemplate={true}
                            coverStructureId={selectedInsurance.id || 0}
                            refetchField={refetch}
                          />
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

export default FieldTemplates;

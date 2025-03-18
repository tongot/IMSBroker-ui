"use client";
import {
  Box,
  Button,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import AddCoverStructureForm from "@/app/underwriters/underwriter-components/AddCoverStructureForm";
import MainContainer from "@/app/components/MainContainer";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useQuery } from "@tanstack/react-query";
import ICoverStructure from "@/app/utils/interfaces/cover-structure/cover-structure";
import { GET } from "@/app/utils/http/GET";
import SingleLineList from "@/app/components/list/SingleLineList";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import CustomAccordion from "@/app/components/CustomAccordion";
import AddCoverStructureFieldForm from "@/app/underwriters/underwriter-components/AddCoverStructureFieldForm";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import FieldRules from "@/app/underwriters/underwriter-components/FieldRules";

const ConfigCoverPage = ({
  params,
}: {
  params: Promise<{ ins_typ_id: string; id: string }>;
}) => {
  const ids = use(params);
  const [currentCoverId, SetCurrentCoverId] = useState(0);
  const [coverName, setCoverName] = useState("");
  const [fieldSearchString, setFieldSearchString] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["underwriters-covers" + ids.ins_typ_id], // Unique key for caching
    queryFn: () => GET<ICoverStructure[]>("/CoverStructure/" + +ids.ins_typ_id), // Function to fetch data
  });

  const {
    data: fieldData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["underwriters-covers-field" + currentCoverId], // Unique key for caching
    queryFn: () =>
      GET<ICoverStructureField[]>("/CoverStructure/field/" + currentCoverId), // Function to fetch data
    enabled: false,
  });

  useEffect(() => {
    if (currentCoverId) refetch();
  }, [currentCoverId, refetch]);

  const handleGetFields = (id: number, name: string) => {
    SetCurrentCoverId(id);
    setCoverName(name);
  };

  const handleFilterField = (searchString: string) => {
    setFieldSearchString(searchString);
  };

  return (
    <MainContainer heading="Cover configurations" icon={<EngineeringIcon />}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 5, xl: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "stretch",
              gap: "1rem",
            }}
          >
            <AddCoverStructureForm
              underwriterId={+ids.id}
              insTypeId={+ids.ins_typ_id}
            />
            {isLoading && <span>Loading...</span>}
            {data && (
              <Paper>
                <List>
                  {data.map((item) => (
                    <>
                      <SingleLineList
                        key={item.id}
                        primaryText={item.name}
                        secondaryText={`Rate: ${item.rate}%`}
                        avatarIcon={<SettingsSuggestIcon />}
                      >
                        <></>
                      </SingleLineList>
                      <ListItem>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            justifyContent: "end",
                          }}
                        >
                          <AddCoverStructureForm
                            underwriterId={+ids.id}
                            insTypeId={+ids.ins_typ_id}
                            editStructure={item}
                          />
                          <AddCoverStructureFieldForm
                            refetchField={refetch}
                            coverStructureId={item.id}
                          />
                          <Button
                            variant="text"
                            onClick={() => handleGetFields(item.id, item.name)}
                          >
                            more...
                          </Button>
                        </Box>
                      </ListItem>
                    </>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid sx={{ px: 4 }} size={{ xs: 12, sm: 12, md: 7, xl: 9 }}>
          {isFetching && <div>Loading...</div>}
          {fieldData ? (
            <div>
              <Typography variant="h6">{coverName} fields</Typography>
              <TextField
                label={`Search Field Name`}
                fullWidth
                value={fieldSearchString}
                onChange={(e) => handleFilterField(e.target.value)}
                sx={{ my: 2 }}
              />
              {fieldData
                .filter((x) =>
                  x.name
                    .toLocaleLowerCase()
                    .includes(fieldSearchString.toLocaleLowerCase())
                )
                .map((item) => (
                  <CustomAccordion
                    key={item.id}
                    panelId={item.id}
                    heading={item.name + " (" + item.type + ")"}
                  >
                    <FieldRules field={item} refetchField={refetch} />
                  </CustomAccordion>
                ))}
              {fieldData.length < 1 && !isFetching && (
                <div>No fields for this cover, press +Field to add</div>
              )}
            </div>
          ) : (
            <div>{!isFetching ? "Please select cover to view fields" : ""}</div>
          )}
        </Grid>
      </Grid>
    </MainContainer>
  );
};

export default ConfigCoverPage;

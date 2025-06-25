"use client";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
  Skeleton,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import AddCoverStructureForm from "@/app/underwriters/underwriter-components/AddCoverStructureForm";
import MainContainer from "@/app/components/layout/MainContainer";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useQuery } from "@tanstack/react-query";
import ICoverStructure from "@/app/utils/interfaces/cover-structure/cover-structure";
import { GET } from "@/app/utils/http/GET";
import SingleLineList from "@/app/components/list/SingleLineList";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AddCoverStructureFieldForm from "@/app/underwriters/underwriter-components/AddCoverStructureFieldForm";
import ICoverStructureField from "@/app/utils/interfaces/cover-structure/cover-structure-field";
import CoverFieldsDisplay from "@/app/underwriters/underwriter-components/CoverFieldsDisplay";
import CustomTab from "@/app/components/custom-components/CustomTab";
import StateMachineView from "@/app/underwriters/underwriter-components/CoverStates";
import { useStateMachineStore } from "@/app/stores/state-machine-store";
import AddCoverStateForm from "@/app/underwriters/underwriter-components/AddCoverStateForm";
import { IAddCoverState } from "@/app/utils/interfaces/state-machine/add-cover-state";
import CoverAddOns from "@/app/underwriters/underwriter-components/CoverAddOns";

const ConfigCoverPage = ({
  params,
}: {
  params: Promise<{ ins_typ_id: string; id: string }>;
}) => {
  const ids = use(params);
  const [currentCoverId, SetCurrentCoverId] = useState(0);
  const [coverName, setCoverName] = useState("");
  const [fieldSearchString, setFieldSearchString] = useState("");

  const getCoverState = useStateMachineStore((state) => state.getStates);
  const states = useStateMachineStore((state) => state.coverStates);
  const addState = useStateMachineStore((state) => state.addState);
  const removeState = useStateMachineStore((state) => state.removeState);
  const updateState = useStateMachineStore((state) => state.updateState);
  const loadingStates = useStateMachineStore((state) => state.loadingStates);

  const { data, isLoading } = useQuery({
    queryKey: ["underwriters-covers" + ids.ins_typ_id],
    queryFn: () => GET<ICoverStructure[]>("/CoverStructure/" + +ids.ins_typ_id),
  });

  const {
    data: fieldData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["underwriters-covers-field" + currentCoverId],
    queryFn: () =>
      GET<ICoverStructureField[]>("/CoverStructure/field/" + currentCoverId),
    enabled: false,
  });

  useEffect(() => {
    if (currentCoverId) {
      refetch();
      getCoverState(currentCoverId);
    }
  }, [currentCoverId, refetch]);

  const handleGetFields = (id: number, name: string) => {
    SetCurrentCoverId(id);
    setCoverName(name);
  };

  const handleAddCoverState = async (state: IAddCoverState) => {
    await addState(state);
  };

  const handleDeleteCoverState = async (stateId: number) => {
    await removeState(stateId);
  };

  const handleUpdateCoverState = async (state: IAddCoverState) => {
    await updateState(state);
  };

  const handleOnSubmitCoverState = async (state: IAddCoverState) => {
    state.stateCategory = "Quotations";
    if (state.id) {
      await handleUpdateCoverState(state);
    } else {
      await handleAddCoverState(state);
    }
  };

  const handleFilterField = (searchString: string) => {
    setFieldSearchString(searchString);
  };

  const fieldDisplay = (
    <Box>
      {isFetching && <Skeleton variant="rectangular" height={100} />}
      {fieldData && !isFetching ? (
        <>
          <AddCoverStructureFieldForm
            refetchField={refetch}
            coverStructureId={currentCoverId}
          />
          <CoverFieldsDisplay
            isFetching={isFetching}
            fieldData={fieldData}
            onFilter={handleFilterField}
            fieldSearchString={fieldSearchString}
            refetch={refetch}
          />
        </>
      ) : (
        <Typography color="text.secondary" mt={2}>
          {!isFetching ? "Please select a cover to view fields." : ""}
        </Typography>
      )}
    </Box>
  );

  const addOns = (
    <Box>{currentCoverId && <CoverAddOns coverId={currentCoverId} />}</Box>
  );

  const statesDisplay = (
    <Box>
      {currentCoverId && (
        <Box>
          <AddCoverStateForm
            loading={loadingStates}
            coverId={currentCoverId}
            onSubmit={handleOnSubmitCoverState}
          />
        </Box>
      )}
      <StateMachineView
        loading={loadingStates}
        currentCoverId={currentCoverId}
        onDelete={handleDeleteCoverState}
        onSubmit={handleOnSubmitCoverState}
        states={states}
      />
    </Box>
  );

  return (
    <MainContainer heading="Cover configurations" icon={<EngineeringIcon />}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5, xl: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <AddCoverStructureForm
              underwriterId={+ids.id}
              insTypeId={+ids.ins_typ_id}
            />
            {isLoading ? (
              <Skeleton variant="rectangular" height={120} />
            ) : (
              data && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <List disablePadding>
                    {data.map((item) => (
                      <Box key={item.id}>
                        <SingleLineList
                          primaryText={item.name}
                          secondaryText={`Rate: ${item.rate}%`}
                          avatarIcon={<SettingsSuggestIcon />}
                        >
                          <></>
                        </SingleLineList>
                        <ListItem sx={{ justifyContent: "flex-end", gap: 1 }}>
                          <AddCoverStructureForm
                            underwriterId={+ids.id}
                            insTypeId={+ids.ins_typ_id}
                            editStructure={item}
                          />
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleGetFields(item.id, item.name)}
                          >
                            more...
                          </Button>
                        </ListItem>
                        <Divider />
                      </Box>
                    ))}
                  </List>
                </Paper>
              )
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 7, xl: 9 }}>
          <Typography variant="h6" gutterBottom>
            {coverName}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <CustomTab
            items={[
              { heading: "Field Settings", children: fieldDisplay },
              { heading: "State Settings", children: statesDisplay },
              { heading: "Add on Overrides", children: addOns },
            ]}
          />
        </Grid>
      </Grid>
    </MainContainer>
  );
};

export default ConfigCoverPage;

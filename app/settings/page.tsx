"use client";
import React, { useState } from "react";
import { Box, Tabs, Tab, Fade } from "@mui/material";
import MainContainer from "../components/MainContainer";
import SettingsIcon from "@mui/icons-material/Settings";
import LookupsDisplay from "./settings-components/Lookup";
import AddOns from "./settings-components/AddOns";
import FieldTemplates from "./settings-components/FieldTemplates";

const SettingsPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newIndex: number
  ): void => {
    setTabIndex(newIndex);
  };

  return (
    <MainContainer
      heading="Settings"
      icon={<SettingsIcon sx={{ fontSize: 34 }} />}
    >
      <Box sx={{ width: "100%", p: 3 }}>
        <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth">
          <Tab label="Lookups" />
          <Tab label="Add-Ons" />
          <Tab label="Field Templates" />
        </Tabs>

        <Box sx={{p: 2}}>
        <Fade in={tabIndex === 0} timeout={500}>
            <Box hidden={tabIndex !== 0}>
                <LookupsDisplay />
            </Box>
        </Fade>

        <Fade in={tabIndex === 1} timeout={500}>
            <Box hidden={tabIndex !==1}>
                <AddOns/>
            </Box>
        </Fade>

        <Fade in={tabIndex === 2} timeout={500}>
            <Box hidden={tabIndex !==2}>
                <FieldTemplates/>
            </Box>
        </Fade>
        </Box>
      </Box>
    </MainContainer>
  );
};

export default SettingsPage;

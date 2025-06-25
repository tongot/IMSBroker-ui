"use client";
import React from "react";
import { Box} from "@mui/material";
import MainContainer from "../components/layout/MainContainer";
import SettingsIcon from "@mui/icons-material/Settings";
import LookupsDisplay from "./settings-components/Lookup";
import AddOns from "./settings-components/AddOns";
import FieldTemplates from "./settings-components/FieldTemplates";
import CustomTab from "../components/custom-components/CustomTab";

const SettingsPage: React.FC = () => {
  return (
    <MainContainer
      heading="Settings"
      icon={<SettingsIcon sx={{ fontSize: 34 }} />}
    >
      <Box sx={{ width: "100%", p: 3 }}>
        <CustomTab
          items={[
            { heading: "Lookups", children: <LookupsDisplay /> },
            { heading: "Add-Ons", children: <AddOns /> },
            { heading: "Field Templates", children: <FieldTemplates /> },
          ]}
        />
      </Box>
    </MainContainer>
  );
};

export default SettingsPage;

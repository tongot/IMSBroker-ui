"use client";
import { Box, Fade, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";

interface ITabItems {
  heading: string;
  children: React.ReactNode;
}

interface CustomTabProps {
  items: ITabItems[];
}

const CustomTab = ({ items }: CustomTabProps) => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newIndex: number
  ): void => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {items.map((item, index) => (
          <Tab
            key={index}
            label={item.heading}
            id={`tab-${index}`}
            aria-controls={`tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {items.map((item, index) => (
        <Fade key={index} in={tabIndex === index} timeout={400} unmountOnExit>
          <Box
            role="tabpanel"
            hidden={tabIndex !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            sx={{ py: 3 }}
          >
            {tabIndex === index && item.children}
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default CustomTab;

import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface CustomAccordionProps {
  children: React.ReactNode;
  panelId: number | string;
  heading: string;
  defaultExpanded?: boolean;
  sx?: SxProps<Theme>;
}

export default function CustomAccordion({
  children,
  panelId,
  heading,
  defaultExpanded = false,
  sx = {},
}: CustomAccordionProps) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{ mb: 0.5, ...sx }}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-content-${panelId}`}
        id={`panel-header-${panelId}`}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          {heading}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

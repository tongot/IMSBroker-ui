import React from "react";
import * as MuiIcons from "@mui/icons-material";
import MatIconProp from "../interfaces/mat-icon-prop";

const DynamicIcon: React.FC<MatIconProp> = ({ icon }) => {
  const IconComponent = MuiIcons[icon];

  return IconComponent ? React.createElement(IconComponent) : <MuiIcons.Help />;
};

export default DynamicIcon;



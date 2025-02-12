'use client';
import React from "react";
import { Avatar, Divider, ListItemIcon, MenuItem } from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import useMenuButton from "../components/MenuButton";

const Dashboard = () => {
  const { handleClose, render } = useMenuButton();

  const content = (
    <div>
      <MenuItem onClick={handleClose}>
        <Avatar /> Profile
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <PersonAdd fontSize="small" />
        </ListItemIcon>
        Add another account
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </div>
    
  );

  const component = render({
    tooltipText: "Account",
    controlType: "button",
    btnVariant: "text",
    size: "medium",
    content: content,
    btnContent:"Options",
    btnColor:"primary"
  });

  return (
    <div>
      {component}
    </div>
  );
};

export default Dashboard;

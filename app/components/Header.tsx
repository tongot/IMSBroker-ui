"use client";
import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Session } from "next-auth";
import { Logout } from "@mui/icons-material";
import { signOut } from "next-auth/react";
import MenuButton from "./MenuButton";

const localUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type SearchAppBarProps = {
  handleDrawerOpen: () => void;
  open: boolean;
  session: Session | null;
};

const PrimarySearchAppBar: React.FC<SearchAppBarProps> = ({
  handleDrawerOpen,
  session,
}) => {
  //const { handleClose, render } = useMenuButton();

  const logout = () => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: `${localUrl}/login` });
  };

  let menuDrop: React.ReactNode = null;

  if (session?.user?.name)
    menuDrop = (
      <MenuButton
        btnContent={session?.user?.name[0].toUpperCase()}
        btnVariant="contained"
        size="medium"
        btnColor="inherit"
        tooltipText="User Menu"
        controlType="icon-button"
      >
          <MenuItem>
            <Avatar /> {session?.user?.name}
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
      </MenuButton>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {session?.user?.name && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Brokers IMS
          </Typography>
          <Box>{menuDrop}</Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default PrimarySearchAppBar;

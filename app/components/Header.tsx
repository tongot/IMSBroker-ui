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
import useMenuButton from "./MenuButton";
import { Logout } from "@mui/icons-material";
import { signOut } from "next-auth/react";

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

  const { handleClose, render } = useMenuButton();

  const logout = () => {
    localStorage.removeItem("token");
    signOut({ callbackUrl: `${localUrl}/login` });
  };
  const content = (
    <div>
      <MenuItem onClick={handleClose}>
        <Avatar /> {session?.user?.name}
      </MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </div>
  );

  let menuDrop: React.ReactNode = null;

  if (session?.user?.name)
    menuDrop = (
      <div>
        {render({
          controlType: "icon-button",
          size: "large",
          content: content,
          btnContent: session.user?.name,
          tooltipText: "My account",
          btnColor: "inherit",
          btnVariant: "text",
        })}
      </div>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Brokers IMS
          </Typography>
          {menuDrop}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default PrimarySearchAppBar;

"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface MenuButtonProps {
  tooltipText: string;
  controlType: "icon-button" | "button";
  btnVariant: "contained" | "outlined" | "text" | undefined;
  size: "small" | "medium" | "large";
  btnColor:
    | "primary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "secondary"
    | "inherit"
    | undefined;
  content: React.ReactNode;
  btnContent: string | null | undefined;
}
const useMenuButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    handleClose,
    render: ({
      tooltipText,
      controlType,
      btnVariant,
      size,
      content,
      btnContent,
      btnColor,
    }: MenuButtonProps) => (
      <div>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          {controlType === "icon-button" ? (
            <Tooltip title={tooltipText}>
              <IconButton
                onClick={handleClick}
                size={size}
                aria-controls={open ? "item-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {btnContent?.substring(0, 2).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={tooltipText}>
              <Button
                onClick={handleClick}
                size={size}
                variant={btnVariant}
                aria-controls={open ? "item-menu" : undefined}
                aria-haspopup="true"
                color={btnColor}
                aria-expanded={open ? "true" : undefined}
                endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {btnContent}
              </Button>
            </Tooltip>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="item-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.09))",
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {content}
        </Menu>
      </div>
    ),
  };
};

export default useMenuButton;

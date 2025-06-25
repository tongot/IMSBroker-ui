"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button, CardActions } from "@mui/material";
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
  btnContent: string | null | undefined;
  children: React.ReactNode;
  canCloseOnClick: boolean;
}

const CustomPopOver = ({
  canCloseOnClick,
  tooltipText,
  controlType,
  btnVariant,
  size,
  btnColor,
  btnContent,
  children,
}: MenuButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = () => {
    if (canCloseOnClick) {
      setAnchorEl(null);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title={tooltipText}>
          {controlType === "button" ? (
            <Button
              variant={btnVariant}
              size={size}
              color={btnColor}
              endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={handleClick}
              sx={{ ml: 2 }}
            >
              {btnContent || "Menu"}
            </Button>
          ) : (
            <IconButton
              onClick={handleClick}
              size={size}
              sx={{ ml: 2 }}
              aria-controls={open ? "account-popover" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {btnContent}
              </Avatar>
            </IconButton>
          )}
        </Tooltip>
      </Box>
      <Popover
        disableScrollLock
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClickMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
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
        }}
      >
        {children}
        {!canCloseOnClick && (
          <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={handleClose} variant="text" color="error">
              Cancel
            </Button>
            {/* Uncomment and add any additional button if needed
            <Button onClick={handleClose} variant="contained" color="error">
              Done
            </Button>
            */}
          </CardActions>
        )}
      </Popover>
    </React.Fragment>
  );
};

export default CustomPopOver;

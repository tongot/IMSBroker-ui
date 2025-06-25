"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Button, CardActions} from "@mui/material";
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
  children:React.ReactNode;
  canCloseOnClick:boolean,
}
const MenuButton = ({canCloseOnClick,tooltipText, controlType, btnVariant, size, btnColor, btnContent, children}:MenuButtonProps) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = () => {
      if(canCloseOnClick)
      {
          setAnchorEl(null);
      }
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={tooltipText}> 
          {controlType === 'button' ? (
            <Button
              variant={btnVariant}
              size={size}
              color={btnColor}
              endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={handleClick}
              sx={{ ml: 2 }}
            >
              {btnContent || 'Menu'}
            </Button>
          ) : (
            <IconButton
              onClick={handleClick}
              size={size}
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>{btnContent}</Avatar>
            </IconButton>
          )}
        </Tooltip>
      </Box>
      <Menu
        disableScrollLock={true}
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClickMenu}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {children}
        {!canCloseOnClick &&<CardActions sx={{display:"flex", justifyContent:"space-between"}}>
          <Button onClick={handleClose} variant="text" color="error">
              Cancel
          </Button>
          {/* <Button  onClick={handleClose}  variant="contained" color="error">
              Done
          </Button> */}
        </CardActions>
        }
      </Menu>
    </React.Fragment>
  );
  };

export default MenuButton;

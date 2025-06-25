"use client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import React from "react";
import DynamicIcon from "../custom-components/DynamicIcon";
import { Route } from "../../utils/routes";
import { useRouter } from "next/navigation";

interface MenuListItemsProps {
  open: boolean;
  routes: Route[];
}
const MenuListItems: React.FC<MenuListItemsProps> = ({ open, routes }) => {
  const router = useRouter();
  return (
    <List>
      {routes.map((route) => (
        <ListItem key={route.name} disablePadding sx={{ display: "block" }}>
          <Tooltip title={route.name} placement="right">
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
              ]}
              onClick={() => {
                if (route.path) {
                  router.push(route.path);
                }
              }}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: "center",
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: "auto",
                      },
                ]}
              >
                {<DynamicIcon icon={route.icon} />}
              </ListItemIcon>
              <ListItemText
                primary={route.name}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
};

export default MenuListItems;

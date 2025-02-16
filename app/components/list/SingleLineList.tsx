'use client'
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

interface SingleLineListProps {
  children: React.ReactNode;
  avatarIcon: React.ReactNode;
  primaryText: string;
  secondaryText?: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number) => void;
  onView?: (id: number) => void;
}
const SingleLineList: React.FC<SingleLineListProps> = ({
  children,
  avatarIcon,
  primaryText,
  secondaryText,
  onDelete,
  onUpdate,
  onView,
}) => {
  return (
    <ListItem
      secondaryAction={
        <Box
          sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
        >
          {onDelete && (
            <IconButton
              onClick={() => onDelete || undefined}
              edge="end"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          )}
          {onUpdate && (
            <IconButton
              onClick={() => onUpdate || undefined}
              edge="end"
              aria-label="delete"
            >
              <EditIcon />
            </IconButton>
          )}
          {onView && (
            <IconButton
              onClick={() => onView || undefined}
              edge="end"
              aria-label="delete"
            >
              <RemoveRedEyeIcon />
            </IconButton>
          )}
          {children}
        </Box>
      }
    >
      <ListItemAvatar>
        <Avatar>{avatarIcon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={primaryText} secondary={secondaryText} />
    </ListItem>
  );
};

export default SingleLineList;

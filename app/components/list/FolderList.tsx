import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface IFolderListItem {
  id?: number;
  icon?: React.ReactNode;
  primary: string;
  secondary: string;
  customButton?: React.ReactNode;
}

interface FolderListProps {
  items: IFolderListItem[];
  removeItem?: (index: number) => void;
  editItem?: (id: number) => void;
}

const FolderList = ({ items, removeItem, editItem }: FolderListProps) => {
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem
            sx={{
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 1 }}>
                {editItem && (
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => editItem(item.id || index)}
                    sx={{ color: "primary.main" }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                {removeItem && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeItem(index)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {item?.customButton}
              </Box>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "primary.main" }}>{item.icon}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.primary}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {item.secondary}
                </Typography>
              }
            />
          </ListItem>
          {index < items.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default FolderList;
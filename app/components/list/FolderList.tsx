import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


interface IFolderListItem {
  id?: number;
  icon?: React.ReactNode;
  primary: string;
  secondary: string;
  customButton?:React.ReactNode
}
interface FolderListProps {
  items: IFolderListItem[];
  removeItem?:(index: number)=>void
  editItem?:(id: number)=>void
}
const FolderList = ({ items, removeItem, editItem }: FolderListProps) => {


  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        padding:0,
      }}
    >
      {items.map((item, index) => (
        <ListItem
          secondaryAction={
            <Box sx={{display:"flex"}}>
              <IconButton edge="end" aria-label="delete" onClick={ removeItem ? ()=>removeItem(index): undefined}>
                  {removeItem && <DeleteIcon color="error" />}
              </IconButton>
              <IconButton edge="end" aria-label="edit" onClick={ editItem ? ()=>editItem(index): undefined}>
                  {editItem && <EditIcon color="success" />}
              </IconButton>
              {item?.customButton}
            </Box>
          }
          key={index}
        >
          <ListItemAvatar>
            <Avatar>{item.icon}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.primary} secondary={item.secondary} />
          <Divider/>
        </ListItem>
      ))}
    </List>
  );
};

export default FolderList;

import { Avatar, MenuItem } from "@mui/material";
import React from "react";

const SingleMenuItem = (
  { handleClose }: { handleClose?: () => void },
  name: string
) => {
  return (
    <MenuItem onClick={handleClose}>
      <Avatar /> {name}
    </MenuItem>
  );
};

export default SingleMenuItem;

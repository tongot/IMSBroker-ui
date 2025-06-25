"use client";
import React, { useState } from "react";
import AddOnOverrideForm from "./AddOnOverrideForm";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { useCoverAddonsQuery } from "@/app/utils/queries/add-ons";
import LoadingPage from "@/app/components/custom-components/LoadingPage";

interface CoverAddOnsProps {
  coverId: number;
}

const CoverAddOns = ({ coverId }: CoverAddOnsProps) => {
  const [searchString, setSearchString] = useState<string>("");

  const { data, isLoading } = useCoverAddonsQuery(coverId);

  const handleSearch = (stringSearch: string) => {
    setSearchString(stringSearch);
  };

  return (
    <>
      <AddOnOverrideForm coverId={coverId} />
      <TextField
        label="Add-On Name"
        fullWidth
        value={searchString}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ mt: 2 }}
      />
      {isLoading && <LoadingPage />}
      {data && (
        <List sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {data.filter((x) =>
              x.name
                ?.toLocaleLowerCase()
                .includes(searchString.toLocaleLowerCase())
            )
            .map((addOn) => (
              <ListItem
                key={addOn.id}
                sx={{
                  borderBottom: "1px solid #eee",
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: "pointer",
                }}
              >
                <ListItemText
                  primary={`${addOn.name} | Default Rate ${addOn.defaultRate}`}
                  secondary={`Override Rate: ${addOn.rate + "%" || "N/A"}`}
                />
                <AddOnOverrideForm coverAddOn={addOn} coverId={coverId} />
              </ListItem>
            ))}
        </List>
      )}
    </>
  );
};

export default CoverAddOns;

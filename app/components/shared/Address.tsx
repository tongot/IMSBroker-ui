"use client";
import { Box, Typography } from "@mui/material";
import React from "react";
import AddressInputButton from "./AddressInputButton";
import FolderList from "../list/FolderList";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { useAddressStore } from "@/app/stores/contact-store";
import { AddressType } from "@/app/interfaces/enums";
import ContactMailIcon from "@mui/icons-material/ContactMail";

interface AddressProps {
  entityId: number;
  entityType: string;
}

const Address = ({ entityId, entityType }: AddressProps) => {
  const storeAddress = useAddressStore((state) => state.addresses);
  const removeAddress = useAddressStore((state) => state.removeAddress);
  const loadingAddresses = useAddressStore((state) => state.loadingAddresses);
  const getAddressFromDb = useAddressStore((state) => state.getAddressFromDb);

  React.useEffect(() => {
    if (entityId > 0) {
      getAddressFromDb(entityId, entityType);
    }
  }, []);

  const getAddressType = (id: number) =>
    AddressType.find((item) => item.value === id)?.member;
  return (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" gutterBottom>
          <ContactMailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Address(es)
        </Typography>
        <AddressInputButton entityId={entityId} entityType={entityType} />
      </Box>
      {loadingAddresses && <p>Loading...</p>}
      {storeAddress.length > 0 && (
        <FolderList
          removeItem={removeAddress}
          items={storeAddress.map((address) => ({
            icon: <ContactPhoneIcon />,
            primary:
              "(" +
              getAddressType(address.addressType) +
              ") | City: " +
              address.city +
              " | Street: " +
              address.street,
            secondary:
              "Country: " +
              address.country +
              " | Postal Code: " +
              address.postalCode,
            id: address.id,
            customButton: (
              <AddressInputButton
                address={storeAddress.find((item) => item.id === address.id)}
                entityId={entityId}
                entityType={entityType}
              />
            ),
          }))}
        />
      )}
    </Box>
  );
};

export default Address;

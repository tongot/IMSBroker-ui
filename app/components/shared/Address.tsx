"use client";
import { Box, Divider, Typography, CircularProgress } from "@mui/material";
import React from "react";
import AddressInputButton from "./AddressInputButton";
import FolderList from "../list/FolderList";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { useAddressStore } from "@/app/stores/contact-store";
import { AddressType } from "@/app/utils/interfaces/enums";
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
  }, [entityId, entityType, getAddressFromDb]);

  const getAddressType = (id: number) =>
    AddressType.find((item) => item.value === id)?.member;

  return (
    <Box
      sx={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <ContactMailIcon sx={{ mr: 1, color: "primary.main" }} />
          Address(es)
        </Typography>
        <AddressInputButton entityId={entityId} entityType={entityType} />
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 1 }} />

      {/* Loading State */}
      {loadingAddresses && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Address List */}
      {!loadingAddresses && storeAddress.length > 0 && (
        <FolderList
          removeItem={removeAddress}
          items={storeAddress.map((address) => ({
            icon: <ContactPhoneIcon />,
            primary: `(${getAddressType(address.addressType)}) | City: ${address.city} | Street: ${address.street}`,
            secondary: `Country: ${address.country} | Postal Code: ${address.postalCode}`,
            id: address?.id,
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

      {/* Empty State */}
      {!loadingAddresses && storeAddress.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}
        >
          No addresses available.
        </Typography>
      )}
    </Box>
  );
};

export default Address;
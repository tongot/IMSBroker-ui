"use client";
import { Box, Divider, Typography, CircularProgress } from "@mui/material";
import React from "react";
import FolderList from "../list/FolderList";
import { useContactStore } from "@/app/stores/contact-store";
import ContactInputButton from "./ContactInputButton";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

interface ContactsProps {
  entityId: number;
  entityType: string;
}

const Contact = ({ entityId, entityType }: ContactsProps) => {
  const storeContacts = useContactStore((state) => state.contacts);
  const removeContact = useContactStore((state) => state.removeContact);
  const loadingContacts = useContactStore((state) => state.loadingContacts);
  const getContactsFromDb = useContactStore((state) => state.getContactsFromDb);

  React.useEffect(() => {
    if (entityId > 0) {
      getContactsFromDb(entityId, entityType);
    }
  }, [entityId, entityType, getContactsFromDb]);

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <ContactPhoneIcon sx={{ mr: 1, color: "primary.main" }} />
          Contact(s)
        </Typography>
        <ContactInputButton entityId={entityId} entityType={entityType} />
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 1 }} />

      {/* Loading State */}
      {loadingContacts && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Contact List */}
      {!loadingContacts && storeContacts.length > 0 && (
        <FolderList
          removeItem={removeContact}
          items={storeContacts.map((contact) => ({
            primary: `Cell: ${contact.mobileNumber} | Tel: ${contact.tel}`,
            secondary: `Email: ${contact.email}`,
            id: contact.id,
            customButton: (
              <ContactInputButton
                editContact={storeContacts.find((item) => item.id === contact.id)}
                entityId={entityId}
                entityType={entityType}
              />
            ),
          }))}
        />
      )}

      {/* Empty State */}
      {!loadingContacts && storeContacts.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
          No contacts available.
        </Typography>
      )}
    </Box>
  );
};

export default Contact;
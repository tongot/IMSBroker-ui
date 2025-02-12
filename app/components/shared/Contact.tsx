"use client";
import { Box, Typography } from "@mui/material";
import React from "react";
import FolderList from "../list/FolderList";
import { useContactStore } from "@/app/stores/contact-store";
import ContactInputButton from "./ContactInputButton";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";


interface ContactsProps {
  entityId: number;
  entityType: string;
}

const Address = ({ entityId, entityType }: ContactsProps) => {
  const storeContacts = useContactStore((state) => state.contacts);
  const removeContact = useContactStore((state) => state.removeContact);
  const loadingContacts = useContactStore((state) => state.loadingContacts);
  const getContactsFromDb = useContactStore((state) => state.getContactsFromDb);

  React.useEffect(() => {
    if (entityId > 0) {
      getContactsFromDb(entityId, entityType);
    }
  }, []);

  return (
    <Box
      sx={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box sx={{display: "flex", justifyContent: "space-between"}}>
        <Typography variant="h6" gutterBottom>
          <ContactPhoneIcon sx={{mr: 1, verticalAlign: "middle"}} />Contact(s)
        </Typography>
        <ContactInputButton entityId={entityId} entityType={entityType} />
      </Box>
      {loadingContacts && <p>Loading...</p>}
      {storeContacts.length > 0 && (
        <FolderList
          removeItem={removeContact}
          items={storeContacts.map((contact) => ({
            primary: "Cell: " + contact.mobileNumber + " | Tel: " + contact.tel,
            secondary: "Email: "+ contact.email,
            id: contact.id,
            customButton: <ContactInputButton editContact={ storeContacts.find(item => item.id === contact.id)} entityId={entityId} entityType={entityType} />
          }))}
        />
      )}
    </Box>
  );
};

export default Address;

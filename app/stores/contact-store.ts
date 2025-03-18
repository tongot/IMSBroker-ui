import { create } from "zustand";
import IAddContact from "../utils/interfaces/contact-information/contact";
import IAddAddress from "../utils/interfaces/contact-information/address";
import IHttpResponse from "../utils/http/http-response";
import POST from "../utils/http/POST";
import { GET } from "../utils/http/GET";


type ContactsStore = {
  loadingContacts: boolean;
  contacts: IAddContact[];
  saveContact: (
    contact: IAddContact,
    entityId: number,
    entityType: string
  ) => Promise<void>;
  removeContact: (index: number) => Promise<void>;
  addContactList: (contacts: IAddContact[]) => void;
  getContactById: (id: number) => IAddContact | undefined;
  getContactsFromDb: (entityId: number, entityType: string) => Promise<void>;
  clearContacts: () => void;
  updateContact:(
    contact: IAddContact,
    entityId: number,
    entityType: string) => Promise<void>;
};

type AddressStore = {
  loadingAddresses: boolean;
  addresses: IAddAddress[];

  saveAddress: (
    contact: IAddAddress,
    entityId: number,
    entityType: string
  ) => Promise<void>;
  removeAddress: (index: number) => Promise<void>;
  getAddressFromDb: (entityId: number, entityType: string) => Promise<void>;
  updateAddress:(
      contact: IAddAddress,
      entityId: number,
      entityType: string) => Promise<void>;

  addAddressList: (addresses: IAddAddress[]) => void;
  clearAddresses: () => void;
};

export const useContactStore = create<ContactsStore>((set, get) => ({
  contacts: [],

  loadingContacts: false,
  saveContact: async (
    contact: IAddContact,
    entityId: number,
    entityType: string
  ) => {
    contact.url = `/contacts/${entityType}/${entityId}/contact`;

    set({ loadingContacts: true });
    const savedContact: IHttpResponse<IAddContact> = await POST(contact, contact.url);
    set({ loadingContacts: false });

    if (savedContact.success) {
      set((state) => ({ contacts: [...state.contacts, savedContact.data] }));
    }
  },

  addContactList: (contact) => set(() => ({ contacts: contact })),
  removeContact: async (index) => {
    const url = `/contacts/${get().contacts[index].id}/contact-delete`;
    const deleteContact: IHttpResponse<string> = await POST({ url: url },url);

    if (deleteContact.success) {
      set((state) => ({
        contacts: state.contacts.filter((_, i) => i !== index),
      }));
    }
  },

  getContactById: (id: number) =>
    get().contacts.find((contact) => contact.id === id),

  getContactsFromDb: async (entityId: number, entityType: string) => {
    set({ loadingContacts: true });
    const addresses = await GET<IAddContact[]>(
      `/contacts/${entityType}/${entityId}/contact`
    );
    set({ loadingContacts: false });
    if (addresses) {
      set({ contacts: addresses });
    }
  },

  updateContact: async(
    address: IAddContact,
    entityId: number,
    entityType: string
  ) => {
    address.url = `/contacts/${entityType}/${entityId}/contact-update`;

    set({ loadingContacts: true });
    const savedContact: IHttpResponse<IAddContact> = await POST(address, address.url);
    set({ loadingContacts: false });

    if (savedContact.success) {
      set((state) => ({ contacts: state.contacts.map((item) => item.id === address.id ? address : item)}));
    }
  },

  clearContacts: () => set({ contacts: [] }),
}));

export const useAddressStore = create<AddressStore>((set, get) => ({
  addresses: [],

  loadingAddresses: false,
  saveAddress: async (
    address: IAddAddress,
    entityId: number,
    entityType: string
  ) => {
    address.url = `/contacts/${entityType}/${entityId}/address`;

    set({ loadingAddresses: true });
    const savedAddress: IHttpResponse<IAddAddress> = await POST(address, address.url);
    set({ loadingAddresses: false });

    if (savedAddress.success) {
      set((state) => ({ addresses: [...state.addresses, savedAddress.data] }));
    }
  },

  addAddressList: (address) => set(() => ({ addresses: address })),

  removeAddress: async (index) =>{
    const url = `/contacts/${get().addresses[index].id}/address-delete`;
    const deleteAddress: IHttpResponse<string> = await POST({ url: url }, url);

    if (deleteAddress.success) {
      set((state) => ({
        addresses: state.addresses.filter((_, i) => i !== index),
      }));
    }
  },
  getAddressFromDb: async (entityId: number, entityType: string) => {
    set({ loadingAddresses: true });
    const addresses = await GET<IAddAddress[]>(
      `/contacts/${entityType}/${entityId}/address`
    );
    set({ loadingAddresses: false });
    if (addresses) {
      set({ addresses: addresses });
    }
  },
  updateAddress: async(
    address: IAddAddress,
    entityId: number,
    entityType: string
  ) => {
    address.url = `/contacts/${entityType}/${entityId}/address-update`;

    set({ loadingAddresses: true });
    const savedContact: IHttpResponse<IAddContact> = await POST(address, address.url);
    set({ loadingAddresses: false });

    if (savedContact.success) {
      set((state) => ({ addresses: state.addresses.map((item) => item.id === address.id ? address : item)}));
    }
  },

  clearAddresses: () => set({ addresses: [] }),
}));

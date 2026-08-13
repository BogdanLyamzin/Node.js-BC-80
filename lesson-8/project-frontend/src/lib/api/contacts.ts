import type { Contact, ContactGroup, ContactsResponse } from "@/types/api";
import type { ContactFormValues } from "@/features/contacts/schemas";
import { apiClient } from "./client";

export function getContactGroups() {
  return apiClient.get<ContactGroup[]>("/contact-groups");
}

export function getContacts() {
  return apiClient.get<ContactsResponse>("/contacts");
}

export function getContactById(id: string) {
  return apiClient.get<Contact>(`/contacts/${id}`);
}

export function createContact(data: ContactFormValues) {
  return apiClient.post("/contacts", data);
}

export function updateContact(id: string, data: ContactFormValues) {
  return apiClient.patch(`/contacts/${id}`, data);
}

export function deleteContact(id: string) {
  return apiClient.delete(`/contacts/${id}`);
}

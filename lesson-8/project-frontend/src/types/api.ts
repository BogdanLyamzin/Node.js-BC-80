import type { Method } from "axios";

export type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  group: ContactGroup | string;
  createdAt: string;
  updatedAt: string;
};

export type ContactGroup = { _id: string; name: string };

export type ContactsResponse = {
  contacts: Contact[];
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: number;
};

export type ApiRequest = {
  method: Method;
  url: string;
  data?: unknown;
  params?: Record<string, string | number>;
};

export type RequestResult = {
  method: string;
  url: string;
  status: number | "network error";
  data: unknown;
  time: string;
};

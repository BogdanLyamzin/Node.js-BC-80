import type { LoginValues, RegisterValues } from "@/features/auth/schemas";
import { apiClient } from "./client";

export function registerUser(values: RegisterValues) {
  const { username, ...data } = values;
  return apiClient.post("/auth/register", {
    ...data,
    ...(username && { username }),
  });
}

export function loginUser(values: LoginValues) {
  return apiClient.post("/auth/login", values);
}

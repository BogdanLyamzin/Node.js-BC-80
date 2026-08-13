import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Введіть коректну адресу e-mail"),
  password: z.string().min(6, "Мінімум 6 символів"),
});

export const registerSchema = loginSchema.extend({
  username: z
    .string()
    .trim()
    .refine((value) => value === "" || value.length >= 3, "Мінімум 3 символи"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

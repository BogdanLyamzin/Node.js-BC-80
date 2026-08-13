import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Мінімум 2 символи"),
  email: z.string().trim().email("Введіть коректну адресу e-mail"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,20}$/, "Введіть номер телефону з 10–20 символів"),
  group: z.string().min(1, "Оберіть групу"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

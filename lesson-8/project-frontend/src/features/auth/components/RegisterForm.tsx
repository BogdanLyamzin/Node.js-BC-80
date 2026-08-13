"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { saveUser } from "@/lib/auth/storage";
import { registerSchema, type RegisterValues } from "../schemas";
import { FormError } from "./FormError";
import styles from "@/app/auth.module.css";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterValues) {
    setServerError("");
    try {
      const { data } = await registerUser(values);
      saveUser(data);
      router.replace("/contacts");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Не вдалося зареєструватися"));
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Contacts API</p>
        <h1>Реєстрація</h1>
        <p className={styles.lead}>
          Створіть обліковий запис і відразу почніть працювати з контактами.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <label>
            Ім’я користувача (необов’язково)
            <input {...form.register("username")} />
            <FormError message={form.formState.errors.username?.message} />
          </label>
          <label>
            E-mail
            <input type="email" {...form.register("email")} />
            <FormError message={form.formState.errors.email?.message} />
          </label>
          <label>
            Пароль
            <input type="password" {...form.register("password")} />
            <FormError message={form.formState.errors.password?.message} />
          </label>
          {serverError && <p className={styles.serverError}>{serverError}</p>}
          <button disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Створюємо…"
              : "Створити обліковий запис"}
          </button>
        </form>
        <p className={styles.footer}>
          Уже маєте обліковий запис? <Link href="/login">Увійти</Link>
        </p>
      </section>
    </main>
  );
}

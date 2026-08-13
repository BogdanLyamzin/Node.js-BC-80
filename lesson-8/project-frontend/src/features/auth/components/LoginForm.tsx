"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { saveUser } from "@/lib/auth/storage";
import { loginSchema, type LoginValues } from "../schemas";
import { FormError } from "./FormError";
import styles from "@/app/auth.module.css";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError("");
    try {
      const { data } = await loginUser(values);
      saveUser(data);
      router.replace("/contacts");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "Не вдалося увійти"));
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Contacts API</p>
        <h1>Вхід</h1>
        <p className={styles.lead}>
          Увійдіть, щоб перейти до керування контактами.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
            {form.formState.isSubmitting ? "Входимо…" : "Увійти"}
          </button>
        </form>
        <p className={styles.footer}>
          Немає облікового запису? <Link href="/register">Зареєструватися</Link>
        </p>
      </section>
    </main>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "@/app/contacts.module.css";
import type { Contact, ContactGroup } from "@/types/api";
import { contactSchema, type ContactFormValues } from "../schemas";

type Props = {
  contact: Contact | null;
  groups: ContactGroup[];
  saving: boolean;
  onClose: () => void;
  onSave: (values: ContactFormValues) => Promise<void>;
};

function contactToValues(contact: Contact | null): ContactFormValues {
  return {
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "+380000000000",
    group:
      typeof contact?.group === "object"
        ? contact.group._id
        : contact?.group || "",
  };
}

export function ContactEditorModal({
  contact,
  groups,
  saving,
  onClose,
  onSave,
}: Props) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactToValues(contact),
  });
  useEffect(() => form.reset(contactToValues(contact)), [contact, form]);
  const isEdit = Boolean(contact);
  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.eyebrow}>
              {isEdit ? "PATCH /contacts/:id" : "POST /contacts"}
            </p>
            <h2 id="editor-title">
              {isEdit ? "Редагувати контакт" : "Новий контакт"}
            </h2>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрити"
          >
            ×
          </button>
        </div>
        <form onSubmit={form.handleSubmit(onSave)} noValidate>
          <label>
            Ім’я
            <input {...form.register("name")} />
            {form.formState.errors.name && (
              <span>{form.formState.errors.name.message}</span>
            )}
          </label>
          <label>
            E-mail
            <input type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <span>{form.formState.errors.email.message}</span>
            )}
          </label>
          <label>
            Телефон
            <input {...form.register("phone")} />
            {form.formState.errors.phone && (
              <span>{form.formState.errors.phone.message}</span>
            )}
          </label>
          <label>
            Група
            <select {...form.register("group")}>
              <option value="">Оберіть групу</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
            {form.formState.errors.group && (
              <span>{form.formState.errors.group.message}</span>
            )}
          </label>
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button disabled={saving}>
              {saving ? "Зберігаємо…" : isEdit ? "Зберегти" : "Додати"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import styles from "@/app/contacts.module.css";
import { getContactById } from "@/lib/api/contacts";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { Contact } from "@/types/api";

type Props = { contactId: string; onClose: () => void };
const groupName = (group: Contact["group"]) =>
  typeof group === "object" ? group.name : group;

export function ContactDetailsModal({ contactId, onClose }: Props) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    async function loadContact() {
      setContact(null);
      setError("");
      try {
        const response = await getContactById(contactId);
        if (!cancelled) setContact(response.data);
      } catch (requestError) {
        if (!cancelled)
          setError(
            getApiErrorMessage(requestError, "Не вдалося завантажити контакт"),
          );
      }
    }
    void loadContact();
    return () => {
      cancelled = true;
    };
  }, [contactId]);
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
        aria-labelledby="details-title"
      >
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.eyebrow}>GET /contacts/:id</p>
            <h2 id="details-title">Картка контакту</h2>
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
        {error && <p className={styles.requestError}>{error}</p>}
        {!error && !contact && (
          <p className={styles.muted}>Завантаження контакту…</p>
        )}
        {contact && (
          <dl className={styles.details}>
            <div>
              <dt>Ім’я</dt>
              <dd>{contact.name}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{contact.email}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd>{contact.phone}</dd>
            </div>
            <div>
              <dt>Група</dt>
              <dd>{groupName(contact.group)}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}

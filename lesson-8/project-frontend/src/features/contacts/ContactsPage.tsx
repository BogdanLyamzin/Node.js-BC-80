"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "@/app/contacts.module.css";
import {
  createContact,
  deleteContact,
  getContactGroups,
  getContacts,
  updateContact,
} from "@/lib/api/contacts";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { clearUser, getUser, type AuthUser } from "@/lib/auth/storage";
import type { Contact, ContactGroup } from "@/types/api";
import type { ContactFormValues } from "./schemas";
import { ContactDetailsModal } from "./components/ContactDetailsModal";
import { ContactEditorModal } from "./components/ContactEditorModal";
import { ContactsList } from "./components/ContactsList";

export function ContactsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [viewId, setViewId] = useState<string | null>(null);
  const [editedContact, setEditedContact] = useState<
    Contact | null | undefined
  >(undefined);

  useEffect(() => {
    const savedUser = getUser();
    if (!savedUser) router.replace("/login");
    else queueMicrotask(() => setUser(savedUser));
  }, [router]);
  const reloadContacts = useCallback(async () => {
    const response = await getContacts();
    setContacts(response.data.contacts);
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadPage() {
      setLoading(true);
      setError("");
      try {
        const [groupsResponse] = await Promise.all([
          getContactGroups(),
          reloadContacts(),
        ]);
        setGroups(groupsResponse.data);
      } catch (requestError) {
        setError(
          getApiErrorMessage(requestError, "Не вдалося завантажити контакти"),
        );
      } finally {
        setLoading(false);
      }
    }
    void loadPage();
  }, [reloadContacts, user]);

  async function saveContact(values: ContactFormValues) {
    setSaving(true);
    setError("");
    try {
      if (editedContact) await updateContact(editedContact._id, values);
      else await createContact(values);
      await reloadContacts();
      setEditedContact(undefined);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Не вдалося зберегти контакт"));
    } finally {
      setSaving(false);
    }
  }

  async function removeContact(contact: Contact) {
    if (!window.confirm(`Видалити контакт «${contact.name}»?`)) return;
    setSaving(true);
    setError("");
    try {
      await deleteContact(contact._id);
      await reloadContacts();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Не вдалося видалити контакт"));
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearUser();
    router.replace("/login");
  }
  if (!user) return <main className={styles.loading}>Перевіряємо сесію…</main>;
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Contacts API</p>
          <h1>Мої контакти</h1>
          <p>Ви ввійшли як {user.username || user.email}</p>
        </div>
        <button type="button" className={styles.secondary} onClick={logout}>
          Вийти
        </button>
      </header>
      <section className={styles.toolbar}>
        <div>
          <h2>Список контактів</h2>
          <p>У списку: {contacts.length}</p>
        </div>
        <button type="button" onClick={() => setEditedContact(null)}>
          + Додати контакт
        </button>
      </section>
      {error && <p className={styles.requestError}>{error}</p>}
      {loading ? (
        <p className={styles.empty}>Завантаження контактів…</p>
      ) : (
        <ContactsList
          contacts={contacts}
          onView={setViewId}
          onEdit={setEditedContact}
          onDelete={(contact) => void removeContact(contact)}
        />
      )}
      {viewId && (
        <ContactDetailsModal
          contactId={viewId}
          onClose={() => setViewId(null)}
        />
      )}
      {editedContact !== undefined && (
        <ContactEditorModal
          contact={editedContact}
          groups={groups}
          saving={saving}
          onClose={() => setEditedContact(undefined)}
          onSave={saveContact}
        />
      )}
    </main>
  );
}

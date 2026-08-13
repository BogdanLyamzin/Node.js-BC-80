import styles from "@/app/contacts.module.css";
import type { Contact } from "@/types/api";

type Props = {
  contacts: Contact[];
  onView: (id: string) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};
const groupName = (group: Contact["group"]) =>
  typeof group === "object" ? group.name : group;

export function ContactsList({ contacts, onView, onEdit, onDelete }: Props) {
  if (!contacts.length)
    return (
      <p className={styles.empty}>
        Контактів поки немає. Додайте перший контакт.
      </p>
    );
  return (
    <div className={styles.list}>
      {contacts.map((contact) => (
        <article className={styles.contact} key={contact._id}>
          <div>
            <p className={styles.contactName}>{contact.name}</p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <p className={styles.phone}>{contact.phone}</p>
            <span className={styles.group}>{groupName(contact.group)}</span>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onView(contact._id)}
            >
              Відкрити
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => onEdit(contact)}
            >
              Змінити
            </button>
            <button
              type="button"
              className={styles.danger}
              onClick={() => onDelete(contact)}
            >
              Видалити
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

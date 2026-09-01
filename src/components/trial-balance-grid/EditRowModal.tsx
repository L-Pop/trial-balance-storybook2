import { useEffect, useState } from "react";
import styles from "./EditRowModal.module.css";
import { IconClose } from "./icons/Icons";
import type { TrialBalanceAccount } from "./data";

export interface EditRowModalProps {
  account: TrialBalanceAccount;
  categoryLabel: string;
  onSave: (changes: { name: string; notes: string }) => void;
  onCancel: () => void;
}

/**
 * Edit-row dialog opened from the toolbar's "Edit" button. Shows every field
 * on the selected account for reference, but only Account Name and Notes are
 * editable — the rest (amounts, category, ref #, status) are computed/ledger
 * data that this demo doesn't let a user hand-edit.
 */
export function EditRowModal({ account, categoryLabel, onSave, onCancel }: EditRowModalProps) {
  const [name, setName] = useState(account.name);
  const [notes, setNotes] = useState(account.notes);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={`Edit ${account.name}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit account</h2>
          <button type="button" className={styles.closeButton} aria-label="Close" onClick={onCancel}>
            <IconClose size={14} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.field}>
            <span className={styles.label}>Account #</span>
            <span className={styles.staticValue}>{account.acctNumber}</span>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="edit-row-name">
              Account name
            </label>
            <input
              id="edit-row-name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.label}>Category</span>
              <span className={styles.staticValue}>{categoryLabel}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Status</span>
              <span className={styles.staticValue}>{account.status}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Debit</span>
              <span className={styles.staticValue}>{account.debit}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Credit</span>
              <span className={styles.staticValue}>{account.credit}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Ref #</span>
              <span className={styles.staticValue}>{account.refNumber}</span>
            </div>
          </div>
          <div className={[styles.field, styles["field--full"]].join(" ")}>
            <label className={styles.label} htmlFor="edit-row-notes">
              Notes
            </label>
            <textarea
              id="edit-row-notes"
              className={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => onSave({ name, notes })}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

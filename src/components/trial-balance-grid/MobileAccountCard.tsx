import styles from "./TrialBalanceGrid.module.css";
import { IconMore, IconStatusFlagged, IconStatusReconciled, IconStatusSelected } from "./icons/Icons";
import type { TrialBalanceAccount } from "./data";

export interface MobileAccountCardProps {
  account: TrialBalanceAccount;
  selected?: boolean;
  onSelect?: () => void;
}

function toneFor(value: string): "positive" | "negative" | "default" {
  if (value.trim().startsWith("(")) return "negative";
  if (/^[\d,]/.test(value.trim())) return "positive";
  return "default";
}

/**
 * Below the card breakpoint, each account becomes a stacked card: label/value
 * pairs replace grid columns, the trailing action collapses into one overflow
 * control, and Notes/Ref # move inside the card instead of scrolling.
 * (Matches the Figma "Mobile — 390 (card fallback)" reference frame.)
 */
export function MobileAccountCard({ account, selected = false, onSelect }: MobileAccountCardProps) {
  const isError = account.forcedVariant === "error";
  const isDisabled = account.forcedVariant === "disabled";

  const cardClass = [
    styles.accountCard,
    selected && !isError && !isDisabled ? styles["accountCard--selected"] : "",
    isError ? styles["accountCard--error"] : "",
    isDisabled ? styles["accountCard--disabled"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const StatusIcon = account.status === "flagged" ? IconStatusFlagged : selected ? IconStatusSelected : IconStatusReconciled;

  const debitTone = toneFor(account.debit);
  const creditTone = toneFor(account.credit);

  return (
    <div className={cardClass} role="button" tabIndex={isDisabled ? -1 : 0} aria-disabled={isDisabled} onClick={isDisabled ? undefined : onSelect}>
      <div className={styles.cardTop}>
        <div className={styles.cardIdentity}>
          <StatusIcon size={18} />
          <span className={styles.cardName}>{account.name}</span>
        </div>
        <IconMore size={18} />
      </div>
      <div className={styles.cardFields}>
        <div className={styles.cardField}>
          <span className={styles.cardFieldLabel}>Debit</span>
          <span className={[styles.cardFieldValue, debitTone === "positive" ? styles["cardFieldValue--positive"] : "", debitTone === "negative" ? styles["cardFieldValue--negative"] : ""].join(" ")}>
            {account.debit}
          </span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.cardFieldLabel}>Credit</span>
          <span className={[styles.cardFieldValue, creditTone === "positive" ? styles["cardFieldValue--positive"] : "", creditTone === "negative" ? styles["cardFieldValue--negative"] : ""].join(" ")}>
            {account.credit}
          </span>
        </div>
      </div>
      <div className={styles.cardFields}>
        <div className={styles.cardField}>
          <span className={styles.cardFieldLabel}>Notes</span>
          <span className={styles.cardFieldValue}>{account.notes}</span>
        </div>
        <div className={styles.cardField}>
          <span className={styles.cardFieldLabel}>Ref #</span>
          <span className={styles.cardFieldValue}>{account.refNumber}</span>
        </div>
      </div>
    </div>
  );
}

import { useState, type KeyboardEvent } from "react";
import styles from "./Cell.module.css";
import { IconError, IconPencil } from "./icons/Icons";
import type { CellVariant } from "./types";

export interface CellProps {
  /** Text property: the value displayed in the cell. */
  cellValue: string;
  /** Boolean property: shows a pencil affordance and lets the value be typed into. */
  editable?: boolean;
  /** Boolean property: shows an inline error glyph, independent of the `error` variant. */
  hasError?: boolean;
  /** Variant selector — Default / Editing / Error. */
  variant?: CellVariant;
  /** Visually tints numeric values (credit-favorable green / unfavorable red). */
  tone?: "default" | "positive" | "negative";
  /** Shown in a hover/focus tooltip — typically an explanation for an error or negative-balance cell. */
  tooltip?: string;
  align?: "start" | "end";
  className?: string;
  onValueChange?: (next: string) => void;
}

/**
 * Cell — generic grid cell (Figma node 28:26).
 * minWidth 72 / maxWidth 220. Text truncates with an ending ellipsis past maxWidth.
 */
export function Cell({
  cellValue,
  editable = false,
  hasError = false,
  variant = "default",
  tone = "default",
  tooltip,
  align = "start",
  className,
  onValueChange,
}: CellProps) {
  const isEditing = variant === "editing";
  const isError = variant === "error";
  const [draft, setDraft] = useState(cellValue);

  function commit() {
    onValueChange?.(draft);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setDraft(cellValue);
    }
  }

  const classNames = [styles.cell, align === "end" ? styles["cell--align-end"] : "", isError ? styles["cell--error"] : "", className]
    .filter(Boolean)
    .join(" ");

  const valueClassNames = [styles.value, tone === "positive" ? styles["value--positive"] : "", tone === "negative" ? styles["value--negative"] : "", cellValue === "—" || cellValue === "" ? styles["value--empty"] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} data-variant={variant} tabIndex={tooltip ? 0 : undefined}>
      {isEditing ? (
        <input
          className={styles.input}
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label="Edit cell value"
        />
      ) : (
        <span className={valueClassNames}>{cellValue}</span>
      )}
      {hasError && !isEditing && <IconError size={14} className={styles.errorIcon} />}
      {editable && !isEditing && <IconPencil size={13} className={styles.pencilIcon} />}
      {tooltip && !isEditing && (
        <span className={styles.tooltip} role="tooltip">
          {tooltip}
        </span>
      )}
    </div>
  );
}

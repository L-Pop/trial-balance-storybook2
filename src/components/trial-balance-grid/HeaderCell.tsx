import styles from "./HeaderCell.module.css";
import { IconFilterActive, IconPin, IconSortAscending, IconSortDescending, IconUnfold } from "./icons/Icons";
import type { HeaderCellVariant } from "./types";

export interface HeaderCellProps {
  /** Text property: the column label. */
  columnLabel: string;
  /** Boolean property: shows/hides the sortable affordance. */
  sortable?: boolean;
  /** Boolean property: shows a pin glyph for a frozen/pinned column. */
  pinned?: boolean;
  /** Variant selector — swaps the trailing icon between unfold / ascending / descending / filter-active. */
  variant?: HeaderCellVariant;
  align?: "start" | "end";
  className?: string;
  onSort?: () => void;
}

/**
 * Header Cell — column header (Figma node 30:44).
 * 'Sortable' shows/hides the sort icon; 'Pinned' shows a pin glyph for a frozen
 * column; the icon slot swaps between unfold / ascending / descending / filter glyphs.
 */
export function HeaderCell({ columnLabel, sortable = false, pinned = false, variant = "default", align = "start", className, onSort }: HeaderCellProps) {
  const classNames = [styles.headerCell, align === "end" ? styles["headerCell--align-end"] : "", sortable ? styles["headerCell--sortable"] : "", className]
    .filter(Boolean)
    .join(" ");

  const Icon = sortable
    ? variant === "sorted-ascending"
      ? IconSortAscending
      : variant === "sorted-descending"
        ? IconSortDescending
        : variant === "filter-active"
          ? IconFilterActive
          : IconUnfold
    : variant === "filter-active"
      ? IconFilterActive
      : null;

  const iconActive = variant === "sorted-ascending" || variant === "sorted-descending" || variant === "filter-active";

  return (
    <div
      className={classNames}
      data-variant={variant}
      role={sortable ? "button" : undefined}
      tabIndex={sortable ? 0 : undefined}
      aria-sort={variant === "sorted-ascending" ? "ascending" : variant === "sorted-descending" ? "descending" : sortable ? "none" : undefined}
      onClick={sortable ? onSort : undefined}
      onKeyDown={
        sortable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSort?.();
              }
            }
          : undefined
      }
    >
      {pinned && <IconPin size={10} className={styles.pin} />}
      <span className={styles.label}>{columnLabel}</span>
      {Icon && <Icon size={14} className={iconActive ? `${styles.icon} ${styles["icon--active"]}` : styles.icon} />}
    </div>
  );
}

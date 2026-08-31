import type { ReactNode } from "react";
import styles from "./Row.module.css";
import { IconMore, IconStatusReconciled } from "./icons/Icons";
import type { InstanceSwapSlot, RowVariant } from "./types";

export interface RowProps {
  /** Variant selector — Default / Hover / Selected / Disabled (read-only) / Error. */
  variant?: RowVariant;
  /**
   * Boolean property: toggles a small inline "selected" badge, independent of
   * the `selected` variant's full container treatment.
   */
  selected?: boolean;
  /**
   * Boolean property: toggles a small inline error badge, independent of the
   * `error` variant's full container treatment.
   */
  hasError?: boolean;
  /** Alternates the default-variant container color (odd/even zebra striping). */
  zebra?: boolean;
  /** Instance-swap slot — leading status badge. Defaults to a reconciled check. */
  leadingSlot?: InstanceSwapSlot;
  /** Instance-swap slot — trailing row action. Defaults to an overflow "more" affordance. */
  trailingSlot?: InstanceSwapSlot;
  /** Pins the leading slot to the left edge of a horizontally-scrolling ancestor (used by the responsive grid). */
  freezeLeading?: boolean;
  /** Pins the trailing slot to the right edge of a horizontally-scrolling ancestor (used by the responsive grid). */
  freezeTrailing?: boolean;
  /** Sizes the row to its content's natural width instead of stretching to fill — lets it overflow a horizontally-scrolling ancestor (used by the responsive grid). */
  fitContent?: boolean;
  /** Cell instances that make up the row body. */
  children: ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Row — grid row composed of Cell instances (Figma node 31:245).
 */
export function Row({
  variant = "default",
  selected = false,
  hasError = false,
  zebra = false,
  leadingSlot,
  trailingSlot,
  freezeLeading = false,
  freezeTrailing = false,
  fitContent = false,
  children,
  interactive = false,
  onClick,
  className,
  ...aria
}: RowProps) {
  const classNames = [
    styles.row,
    zebra && variant === "default" ? styles["row--zebra"] : "",
    interactive && variant === "default" ? styles["row--interactive"] : "",
    variant === "hover" ? styles["row--hover"] : "",
    variant === "selected" ? styles["row--selected"] : "",
    variant === "disabled" ? styles["row--disabled"] : "",
    variant === "error" ? styles["row--error"] : "",
    freezeLeading ? styles["row--freeze-leading"] : "",
    freezeTrailing ? styles["row--freeze-trailing"] : "",
    fitContent ? styles["row--fit-content"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      data-variant={variant}
      role="row"
      aria-selected={variant === "selected" || selected || undefined}
      aria-disabled={variant === "disabled" || undefined}
      onClick={interactive ? onClick : undefined}
      {...aria}
    >
      <span className={styles.leading}>{leadingSlot ?? <IconStatusReconciled />}</span>
      {selected && <span className={`${styles.badge} ${styles["badge--selected"]}`} aria-hidden="true" />}
      {hasError && <span className={`${styles.badge} ${styles["badge--error"]}`} aria-hidden="true" />}
      <div className={styles.cells}>{children}</div>
      <span className={styles.trailing}>{trailingSlot ?? <IconMore />}</span>
    </div>
  );
}

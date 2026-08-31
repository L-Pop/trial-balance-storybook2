import { useState } from "react";
import styles from "./Toolbar.module.css";
import { IconCheck, IconClose, IconFilter, IconSearch } from "./icons/Icons";
import type { ToolbarVariant } from "./types";

export interface FilterChip {
  label: string;
  active?: boolean;
}

export interface ToolbarProps {
  /** Text property: overrides the search field's placeholder (and, once typed, its value). */
  searchQuery?: string;
  /** Boolean property: reveals the removable filter-chip row and tints the filter button. */
  filtersApplied?: boolean;
  /** Variant selector — Default / Search active / Filters applied. */
  variant?: ToolbarVariant;
  filters?: FilterChip[];
  onSearchChange?: (value: string) => void;
  onToggleFilter?: (label: string) => void;
  onOpenFilters?: () => void;
  className?: string;
}

const DEFAULT_FILTERS: FilterChip[] = [
  { label: "All accounts", active: true },
  { label: "Assets" },
  { label: "Liabilities" },
  { label: "Equity" },
  { label: "Revenue" },
  { label: "Expenses" },
];

/**
 * Toolbar — table toolbar (Figma node 33:135).
 * 'Filters Applied' reveals the removable filter-chip row and tints the filter
 * button. 'Search Query' overrides the search field's placeholder.
 */
export function Toolbar({
  searchQuery = "",
  filtersApplied = false,
  variant = "default",
  filters = DEFAULT_FILTERS,
  onSearchChange,
  onToggleFilter,
  onOpenFilters,
  className,
}: ToolbarProps) {
  const [value, setValue] = useState(variant === "search-active" ? searchQuery : "");
  const isSearchActive = variant === "search-active";
  const showChips = filtersApplied || variant === "filters-applied";

  return (
    <div className={[styles.toolbar, className].filter(Boolean).join(" ")}>
      <div className={styles.searchRow}>
        <div className={[styles.searchField, isSearchActive ? styles["searchField--active"] : ""].join(" ")}>
          <IconSearch size={20} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder={searchQuery || "Search accounts"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            aria-label="Search accounts"
          />
          {isSearchActive && value && (
            <button type="button" className={styles.clearButton} aria-label="Clear search" onClick={() => setValue("")}>
              <IconClose size={12} />
            </button>
          )}
        </div>
        <button
          type="button"
          className={[styles.filterButton, showChips ? styles["filterButton--active"] : ""].join(" ")}
          aria-pressed={showChips}
          aria-label="Toggle filters"
          onClick={onOpenFilters}
        >
          <IconFilter size={20} />
        </button>
      </div>
      {showChips && (
        <div className={styles.chipRow} role="group" aria-label="Account type filters">
          {filters.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className={[styles.chip, chip.active ? styles["chip--active"] : ""].join(" ")}
              aria-pressed={!!chip.active}
              onClick={() => onToggleFilter?.(chip.label)}
            >
              {chip.active && <IconCheck size={14} className={styles.chipIcon} />}
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

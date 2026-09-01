import { useState } from "react";
import styles from "./Toolbar.module.css";
import { IconCalendar, IconCheck, IconClose, IconDownload, IconFilter, IconSearch, IconSettings } from "./icons/Icons";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";
import { DateRangeCalendar, formatRangeLabel } from "./DateRangeCalendar";
import type { ToolbarVariant } from "./types";

export interface FilterChip {
  label: string;
  active?: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ColumnOption {
  key: string;
  label: string;
  visible: boolean;
}

export interface ToolbarProps {
  /** Text property: overrides the search field's placeholder (and, once typed, its value). */
  searchQuery?: string;
  /** Boolean property: reveals the removable filter-chip row and tints the filter button. */
  filtersApplied?: boolean;
  /** Variant selector — Default / Search active / Filters applied. */
  variant?: ToolbarVariant;
  filters?: FilterChip[];
  /** Seeds the date-range control's start/end values (each an `<input type="date">` value, e.g. "2026-08-01"). */
  dateRange?: DateRange;
  /** Toggleable columns shown in the settings menu next to the date range picker. Omit to hide the settings control. */
  columns?: ColumnOption[];
  onSearchChange?: (value: string) => void;
  /** Committed search terms, shown as removable chips below the search field — lets customers narrow to multiple terms at once. */
  searchTerms?: string[];
  /** Called when the user presses Enter in the search field with non-empty text, committing it as a new chip. */
  onAddSearchTerm?: (term: string) => void;
  /** Called when a search-term chip's remove button is clicked. */
  onRemoveSearchTerm?: (term: string) => void;
  onToggleFilter?: (label: string) => void;
  onOpenFilters?: () => void;
  onDateRangeChange?: (range: DateRange) => void;
  onToggleColumn?: (key: string) => void;
  /** Called when the "Edit" button is clicked. Omit to hide the button entirely. */
  onEdit?: () => void;
  /** Shows the "Edit" button in its pressed state. */
  editActive?: boolean;
  /** Called when "Export to PDF" is chosen. Omit to hide the export control entirely. */
  onExportPdf?: () => void;
  /** Called when "Export to Excel" is chosen. */
  onExportExcel?: () => void;
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
  dateRange,
  columns,
  onSearchChange,
  searchTerms = [],
  onAddSearchTerm,
  onRemoveSearchTerm,
  onToggleFilter,
  onOpenFilters,
  onDateRangeChange,
  onToggleColumn,
  onEdit,
  editActive = false,
  onExportPdf,
  onExportExcel,
  className,
}: ToolbarProps) {
  const [value, setValue] = useState(variant === "search-active" ? searchQuery : "");
  const [range, setRange] = useState<DateRange>(dateRange ?? { start: "", end: "" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const isSearchActive = variant === "search-active" || searchTerms.length > 0;
  const showChips = filtersApplied || variant === "filters-applied";
  const showExport = onExportPdf || onExportExcel;

  const settingsRef = useCloseOnOutsideClick(settingsOpen, () => setSettingsOpen(false));
  const exportRef = useCloseOnOutsideClick(exportOpen, () => setExportOpen(false));
  const dateRangeRef = useCloseOnOutsideClick(dateRangeOpen, () => setDateRangeOpen(false));

  function updateRange(next: DateRange) {
    setRange(next);
    onDateRangeChange?.(next);
  }

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
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const term = value.trim();
              if (!term) return;
              e.preventDefault();
              onAddSearchTerm?.(term);
              setValue("");
              onSearchChange?.("");
            }}
            aria-label="Search accounts"
          />
          {isSearchActive && value && (
            <button type="button" className={styles.clearButton} aria-label="Clear search" onClick={() => setValue("")}>
              <IconClose size={12} />
            </button>
          )}
        </div>
        <div className={styles.menuWrap} ref={dateRangeRef}>
          <button
            type="button"
            className={[styles.dateRange, dateRangeOpen ? styles["dateRange--active"] : ""].join(" ")}
            aria-haspopup="dialog"
            aria-expanded={dateRangeOpen}
            onClick={() => setDateRangeOpen((v) => !v)}
          >
            <IconCalendar size={18} className={styles.dateRangeIcon} />
            <span className={styles.dateRangeLabel}>{formatRangeLabel(range)}</span>
          </button>
          {dateRangeOpen && (
            <div className={styles.dateRangeDropdown}>
              <DateRangeCalendar
                value={range}
                onApply={(next) => {
                  updateRange(next);
                  setDateRangeOpen(false);
                }}
                onCancel={() => setDateRangeOpen(false)}
              />
            </div>
          )}
        </div>
        {columns && columns.length > 0 && (
          <div className={styles.menuWrap} ref={settingsRef}>
            <button
              type="button"
              className={[styles.iconButton, settingsOpen ? styles["iconButton--active"] : ""].join(" ")}
              aria-pressed={settingsOpen}
              aria-label="Table display settings"
              aria-haspopup="true"
              aria-expanded={settingsOpen}
              onClick={() => setSettingsOpen((v) => !v)}
            >
              <IconSettings size={18} />
            </button>
            {settingsOpen && (
              <div className={styles.menu} role="menu" aria-label="Show or hide columns">
                <p className={styles.menuHeading}>Show columns</p>
                {columns.map((col) => (
                  <label key={col.key} className={styles.menuCheckboxRow}>
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => onToggleColumn?.(col.key)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          className={[styles.filterButton, showChips ? styles["filterButton--active"] : ""].join(" ")}
          aria-pressed={showChips}
          aria-label="Toggle filters"
          onClick={onOpenFilters}
        >
          <IconFilter size={20} />
        </button>
        {onEdit && (
          <button
            type="button"
            className={[styles.secondaryButton, editActive ? styles["secondaryButton--active"] : ""].join(" ")}
            aria-pressed={editActive}
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        {showExport && (
          <div className={styles.menuWrap} ref={exportRef}>
            <button
              type="button"
              className={[styles.exportButton, exportOpen ? styles["exportButton--active"] : ""].join(" ")}
              aria-haspopup="true"
              aria-expanded={exportOpen}
              onClick={() => setExportOpen((v) => !v)}
            >
              <IconDownload size={18} />
              Export
            </button>
            {exportOpen && (
              <div className={[styles.menu, styles["menu--right"]].join(" ")} role="menu" aria-label="Export options">
                {onExportPdf && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => {
                      setExportOpen(false);
                      onExportPdf();
                    }}
                  >
                    Export to PDF
                  </button>
                )}
                {onExportExcel && (
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => {
                      setExportOpen(false);
                      onExportExcel();
                    }}
                  >
                    Export to Excel
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {searchTerms.length > 0 && (
        <div className={styles.chipRow} role="group" aria-label="Search terms">
          {searchTerms.map((term) => (
            <button
              key={term}
              type="button"
              className={[styles.chip, styles["chip--active"]].join(" ")}
              onClick={() => onRemoveSearchTerm?.(term)}
              aria-label={`Remove search term "${term}"`}
            >
              {term}
              <IconClose size={10} className={styles.chipIcon} />
            </button>
          ))}
        </div>
      )}
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

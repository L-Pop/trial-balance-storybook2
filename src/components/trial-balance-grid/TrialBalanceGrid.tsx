import { useMemo, useState } from "react";
import styles from "./TrialBalanceGrid.module.css";
import { Toolbar } from "./Toolbar";
import { HeaderCell } from "./HeaderCell";
import { Row } from "./Row";
import { Cell } from "./Cell";
import { MobileAccountCard } from "./MobileAccountCard";
import { useContainerWidth } from "./useContainerWidth";
import {
  sampleAccounts,
  type AccountCategory,
  type TrialBalanceAccount,
} from "./data";
import {
  IconMore,
  IconStatusFlagged,
  IconStatusNone,
  IconStatusSelected,
} from "./icons/Icons";
import type { HeaderCellVariant } from "./types";

export interface TrialBalanceGridProps {
  accounts?: TrialBalanceAccount[];
  title?: string;
  subtitle?: string;
  /** Shows a small chip reporting the live layout + measured width — handy for the responsive-behavior demo. */
  showLayoutBadge?: boolean;
  defaultSelectedId?: string | null;
}

type SortKey = "name" | "debit" | "credit" | null;
type Layout = "desktop" | "tablet" | "mobile";

const CATEGORY_LABEL: Record<AccountCategory, string> = {
  assets: "Assets",
  liabilities: "Liabilities",
  equity: "Equity",
  revenue: "Revenue",
  expenses: "Expenses",
};

function parseAmount(value: string): number {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return 0;
  const negative = trimmed.startsWith("(");
  const numeric = Number(trimmed.replace(/[(),$]/g, ""));
  return negative ? -numeric : numeric;
}

const NEGATIVE_BALANCE_EXPLANATION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function toneFor(value: string): "positive" | "negative" | "default" {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") return "default";
  return trimmed.startsWith("(") ? "negative" : "positive";
}

function formatAmount(value: number): string {
  if (value === 0) return "—";
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return value < 0 ? `(${abs})` : abs;
}

/** Escapes a field for CSV per RFC 4180 (wraps in quotes, doubles embedded quotes). */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

type ToggleableColumn = "debit" | "credit" | "notes" | "ref";

const COLUMN_LABELS: Record<ToggleableColumn, string> = {
  debit: "Debit",
  credit: "Credit",
  notes: "Notes",
  ref: "Ref #",
};

/**
 * Row's trailing "more" action, with a hover/focus tooltip offering to
 * include or exclude the row from the grid's totals.
 */
function RowActionsTooltip({
  excluded,
  onToggle,
  accountName,
}: {
  excluded: boolean;
  onToggle: () => void;
  accountName: string;
}) {
  return (
    <span className={styles.rowActions}>
      <button
        type="button"
        className={styles.rowActionsButton}
        aria-label={`Row options for ${accountName}`}
      >
        <IconMore />
      </button>
      <span className={styles.rowActionsTooltip} role="tooltip">
        <button
          type="button"
          className={styles.rowActionsTooltipAction}
          aria-disabled={!excluded}
          onClick={(e) => {
            e.stopPropagation();
            if (excluded) onToggle();
          }}
        >
          Include
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          className={styles.rowActionsTooltipAction}
          aria-disabled={excluded}
          onClick={(e) => {
            e.stopPropagation();
            if (!excluded) onToggle();
          }}
        >
          Exclude
        </button>
      </span>
    </span>
  );
}

/**
 * TrialBalanceGrid — the mock reference-app screen that composes Toolbar,
 * Header Cell, Row and Cell into a full "Ledger" page, and demonstrates the
 * exact responsive behavior specified on the Figma "Responsive Demo" page:
 *
 *   >= 900px  desktop — all columns visible inline
 *   640–899px tablet  — Account Name (+ leading status + trailing action)
 *                       freezes; Debit/Credit/Notes/Ref # scroll horizontally
 *                       beneath it; Notes hides first once space gets tight
 *   < 640px   mobile  — one stacked card per account
 *
 * Layout is measured from the component's own rendered width (ResizeObserver),
 * so it responds identically to the Storybook viewport toolbar or a manually
 * resized wrapper.
 */
export function TrialBalanceGrid({
  accounts = sampleAccounts,
  title = "Trial Balance",
  subtitle = "As of August 31, 2026",
  showLayoutBadge = false,
  defaultSelectedId = "1100",
}: TrialBalanceGridProps) {
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  const layout: Layout =
    width === 0
      ? "desktop"
      : width < 640
        ? "mobile"
        : width < 900
          ? "tablet"
          : "desktop";
  const hideNotes = layout === "tablet" && width > 0 && width < 700;

  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<
    Set<AccountCategory>
  >(new Set());
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<"ascending" | "descending">(
    "ascending",
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultSelectedId,
  );
  const [scrolled, setScrolled] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<Set<ToggleableColumn>>(
    new Set(),
  );
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());

  function handleToggleExcluded(id: string) {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filters = useMemo(() => {
    const present = Array.from(new Set(accounts.map((a) => a.category)));
    return [
      {
        label: "All accounts",
        active: activeCategories.size === 0,
        category: null as AccountCategory | null,
      },
      ...present.map((category) => ({
        label: CATEGORY_LABEL[category],
        active: activeCategories.has(category),
        category,
      })),
    ];
  }, [accounts, activeCategories]);

  function handleToggleFilter(label: string) {
    if (label === "All accounts") {
      setActiveCategories(new Set());
      return;
    }
    const category = filters.find((f) => f.label === label)?.category;
    if (!category) return;
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function handleToggleColumn(key: string) {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key as ToggleableColumn)) next.delete(key as ToggleableColumn);
      else next.add(key as ToggleableColumn);
      return next;
    });
  }

  function handleSort(key: Exclude<SortKey, null>) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("ascending");
    } else if (sortDir === "ascending") {
      setSortDir("descending");
    } else {
      setSortKey(null);
    }
  }

  function headerVariant(key: Exclude<SortKey, null>): HeaderCellVariant {
    if (sortKey !== key) return "default";
    return sortDir === "ascending" ? "sorted-ascending" : "sorted-descending";
  }

  const visibleAccounts = useMemo(() => {
    let list = accounts;
    if (activeCategories.size > 0) {
      list = list.filter((a) => activeCategories.has(a.category));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.acctNumber.includes(q),
      );
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const dir = sortDir === "ascending" ? 1 : -1;
        if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
        return (parseAmount(a[sortKey]) - parseAmount(b[sortKey])) * dir;
      });
    }
    return list;
  }, [accounts, activeCategories, search, sortKey, sortDir]);

  const totals = useMemo(
    () =>
      visibleAccounts
        .filter((account) => !excludedIds.has(account.id))
        .reduce(
          (acc, account) => {
            acc.debit += parseAmount(account.debit);
            acc.credit += parseAmount(account.credit);
            return acc;
          },
          { debit: 0, credit: 0 },
        ),
    [visibleAccounts, excludedIds],
  );

  function handleExportPdf() {
    window.print();
  }

  function handleExportExcel() {
    const headers = ["Account #", "Account Name", "Debit", "Credit", "Notes", "Ref #"];
    const rows = visibleAccounts.map((a) => [
      a.acctNumber,
      a.name,
      a.debit,
      a.credit,
      a.notes,
      a.refNumber,
    ]);
    rows.push(["", "Total", formatAmount(totals.debit), formatAmount(totals.credit), "", ""]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvField).join(","))
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trial-balance.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const isTablet = layout === "tablet";
  // Account Name freezes at every non-mobile width, not just tablet, so it
  // stays visible whenever the table scrolls horizontally.
  const freezeAccountName = layout !== "mobile";
  const showNotes = !hideNotes && !hiddenColumns.has("notes");
  const showDebit = !hiddenColumns.has("debit");
  const showCredit = !hiddenColumns.has("credit");
  const showRef = !hiddenColumns.has("ref");
  const columnOptions = (["debit", "credit", "notes", "ref"] as const).map(
    (key) => ({
      key,
      label: COLUMN_LABELS[key],
      visible: !hiddenColumns.has(key),
    }),
  );

  return (
    <div className={styles.appShell} data-layout={layout}>
      <div className={styles.appBar}>
        <p className={styles.appBarTitle}>Ledger</p>
      </div>
      <div className={styles.content} ref={ref}>
        <div>
          <h2 className={styles.heading}>{title}</h2>
          <p className={styles.subheading}>{subtitle}</p>
        </div>

        {showLayoutBadge && (
          <span className={styles.layoutBadge}>
            {layout} · {Math.round(width)}px{hideNotes ? " · notes hidden" : ""}
          </span>
        )}

        <Toolbar
          variant={
            search
              ? "search-active"
              : activeCategories.size > 0
                ? "filters-applied"
                : "default"
          }
          filtersApplied={activeCategories.size > 0}
          filters={filters}
          columns={columnOptions}
          onSearchChange={setSearch}
          onToggleFilter={handleToggleFilter}
          onToggleColumn={handleToggleColumn}
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}
        />

        {layout === "mobile" ? (
          <div className={styles.cardList}>
            {visibleAccounts.map((account) => (
              <MobileAccountCard
                key={account.id}
                account={account}
                selected={account.id === selectedId}
                excluded={excludedIds.has(account.id)}
                onSelect={() => setSelectedId(account.id)}
              />
            ))}
            {visibleAccounts.length === 0 && (
              <div className={styles.emptyState}>
                No accounts match your search.
              </div>
            )}
            {visibleAccounts.length > 0 && (
              <div className={styles.mobileTotals}>
                <span>
                  Total Debit <strong>{formatAmount(totals.debit)}</strong>
                </span>
                <span>
                  Total Credit <strong>{formatAmount(totals.credit)}</strong>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.card}>
            <div
              className={freezeAccountName ? styles.hvScroll : styles.vScroll}
              onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
            >
              <div className={styles.table}>
                <div
                  className={[
                    styles.headerRow,
                    scrolled ? styles["headerRow--scrolled"] : "",
                  ].join(" ")}
                  role="row"
                >
                  <div
                    className={freezeAccountName ? styles.sticky : styles.colAccountName}
                  >
                    <div className={styles.colStatusSpacer} aria-hidden="true" />
                    <div className={styles.colAcctNumber}>
                      <HeaderCell columnLabel="Acct #" />
                    </div>
                    <div className={styles.colAccountNameInner}>
                      <HeaderCell
                        columnLabel="Account Name"
                        sortable
                        pinned={freezeAccountName}
                        variant={headerVariant("name")}
                        onSort={() => handleSort("name")}
                      />
                    </div>
                    {freezeAccountName && (
                      <>
                        <span
                          className={styles.stickyDivider}
                          aria-hidden="true"
                        />
                        <span
                          className={styles.stickyShadow}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </div>
                  {showDebit && (
                    <div className={styles.colDebit}>
                      <HeaderCell
                        columnLabel="Debit"
                        sortable
                        align="end"
                        variant={headerVariant("debit")}
                        onSort={() => handleSort("debit")}
                      />
                    </div>
                  )}
                  {showCredit && (
                    <div className={styles.colCredit}>
                      <HeaderCell
                        columnLabel="Credit"
                        sortable
                        align="end"
                        variant={headerVariant("credit")}
                        onSort={() => handleSort("credit")}
                      />
                    </div>
                  )}
                  {showNotes && (
                    <div className={styles.colNotes}>
                      <HeaderCell columnLabel="Notes" />
                    </div>
                  )}
                  {showRef && (
                    <div className={styles.colRef}>
                      <HeaderCell columnLabel="Ref #" />
                    </div>
                  )}
                </div>

                {visibleAccounts.map((account, index) => {
                  const variant =
                    account.forcedVariant ??
                    (account.id === selectedId ? "selected" : "default");
                  const StatusIcon =
                    account.status === "flagged"
                      ? IconStatusFlagged
                      : account.id === selectedId
                        ? IconStatusSelected
                        : IconStatusNone;
                  const excluded = excludedIds.has(account.id);
                  return (
                    <div
                      key={account.id}
                      className={styles.bodyRow}
                      data-excluded={excluded || undefined}
                    >
                      <Row
                        variant={variant}
                        zebra={index % 2 === 1}
                        interactive={variant !== "disabled"}
                        freezeLeading={freezeAccountName}
                        freezeTrailing={freezeAccountName}
                        fitContent={freezeAccountName}
                        onClick={() => setSelectedId(account.id)}
                        aria-label={account.name}
                        leadingSlot={
                          <span className={styles.frozenIdentity}>
                            <StatusIcon size={16} />
                            <span className={styles.acctNumberBadge}>{account.acctNumber}</span>
                            <Cell cellValue={account.name} />
                          </span>
                        }
                        trailingSlot={
                          <RowActionsTooltip
                            excluded={excluded}
                            onToggle={() => handleToggleExcluded(account.id)}
                            accountName={account.name}
                          />
                        }
                      >
                        {showDebit && (
                          <div className={styles.colDebit}>
                            <Cell
                              cellValue={account.debit}
                              align="end"
                              tone={toneFor(account.debit)}
                              tooltip={
                                toneFor(account.debit) === "negative"
                                  ? NEGATIVE_BALANCE_EXPLANATION
                                  : undefined
                              }
                            />
                          </div>
                        )}
                        {showCredit && (
                          <div className={styles.colCredit}>
                            <Cell
                              cellValue={account.credit}
                              align="end"
                              tone={toneFor(account.credit)}
                              hasError={
                                account.status === "flagged" &&
                                toneFor(account.credit) === "negative"
                              }
                              tooltip={
                                toneFor(account.credit) === "negative"
                                  ? NEGATIVE_BALANCE_EXPLANATION
                                  : undefined
                              }
                            />
                          </div>
                        )}
                        {showNotes && (
                          <div className={styles.colNotes}>
                            <Cell cellValue={account.notes} />
                          </div>
                        )}
                        {showRef && (
                          <div className={styles.colRef}>
                            <Cell cellValue={account.refNumber} />
                          </div>
                        )}
                      </Row>
                    </div>
                  );
                })}
                {visibleAccounts.length === 0 && (
                  <div className={styles.emptyState}>
                    No accounts match your search.
                  </div>
                )}
                {visibleAccounts.length > 0 && (
                  <div
                    className={[
                      styles.totalRow,
                      isTablet ? styles["totalRow--tablet"] : "",
                    ].join(" ")}
                    role="row"
                  >
                    <div className={freezeAccountName ? styles.sticky : styles.colAccountName}>
                      <span className={styles.totalLabel}>Total</span>
                    </div>
                    {showDebit && (
                      <div className={styles.colDebit}>
                        <span className={styles.totalValue}>{formatAmount(totals.debit)}</span>
                      </div>
                    )}
                    {showCredit && (
                      <div className={styles.colCredit}>
                        <span className={styles.totalValue}>{formatAmount(totals.credit)}</span>
                      </div>
                    )}
                    {showNotes && <div className={styles.colNotes} />}
                    {showRef && <div className={styles.colRef} />}
                  </div>
                )}
              </div>
            </div>
            {isTablet && (
              <div className={styles.scrollHint}>
                Scroll horizontally for Notes and Ref # — Account Name and
                actions stay pinned.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

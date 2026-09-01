import { useState } from "react";
import styles from "./DateRangeCalendar.module.css";
import type { DateRange } from "./Toolbar";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function parseISO(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatShort(date: Date | null, placeholder: string): string {
  if (!date) return placeholder;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function buildMonthGrid(monthStart: Date): (Date | null)[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

/** Trigger-button label: "Sep 1 – Sep 20", "Sep 1 – …", or a placeholder. */
export function formatRangeLabel(range: DateRange): string {
  const start = parseISO(range.start);
  const end = parseISO(range.end);
  if (!start) return "Select dates";
  if (!end) return `${formatShort(start, "")} – …`;
  return `${formatShort(start, "")} – ${formatShort(end, "")}`;
}

export interface DateRangeCalendarProps {
  value: DateRange;
  onApply: (range: DateRange) => void;
  onCancel: () => void;
}

/**
 * Material Design-style date range picker: a single-month calendar with
 * click-to-select start/end dates, a connecting range-highlight band, month
 * navigation, and Cancel/OK actions. Replaces the browser's native date
 * inputs so the whole toolbar stays visually consistent.
 */
export function DateRangeCalendar({ value, onApply, onCancel }: DateRangeCalendarProps) {
  const initialStart = parseISO(value.start);
  const initialEnd = parseISO(value.end);
  const [pendingStart, setPendingStart] = useState<Date | null>(initialStart);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(initialEnd);
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(initialStart ?? new Date()));

  const cells = buildMonthGrid(visibleMonth);
  const monthLabel = visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function handleDayClick(day: Date) {
    if (!pendingStart || pendingEnd || day < pendingStart) {
      setPendingStart(day);
      setPendingEnd(null);
    } else {
      setPendingEnd(day);
    }
  }

  return (
    <div className={styles.picker} role="dialog" aria-label="Select date range">
      <div className={styles.header}>
        <div className={styles.headerField}>
          <span className={styles.headerLabel}>Start date</span>
          <span className={styles.headerValue}>{formatShort(pendingStart, "—")}</span>
        </div>
        <span className={styles.headerArrow} aria-hidden="true">
          →
        </span>
        <div className={styles.headerField}>
          <span className={styles.headerLabel}>End date</span>
          <span className={styles.headerValue}>{formatShort(pendingEnd, "—")}</span>
        </div>
      </div>

      <div className={styles.monthNav}>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Previous month"
          onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
        >
          ‹
        </button>
        <span className={styles.monthLabel}>{monthLabel}</span>
        <button
          type="button"
          className={styles.navButton}
          aria-label="Next month"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
        >
          ›
        </button>
      </div>

      <div className={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((w, i) => (
          <span key={i} className={styles.weekdayLabel}>
            {w}
          </span>
        ))}
      </div>

      <div className={styles.dayGrid}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} className={styles.dayCell} />;
          const isStart = isSameDay(day, pendingStart);
          const isEnd = isSameDay(day, pendingEnd);
          const isAnchor = isStart || isEnd;
          const inRange = !!pendingStart && !!pendingEnd && day > pendingStart && day < pendingEnd;
          const dayOfWeek = i % 7;
          const cellClass = [
            styles.dayCell,
            inRange || isAnchor ? styles["dayCell--inBand"] : "",
            isStart || dayOfWeek === 0 ? styles["dayCell--roundLeft"] : "",
            isEnd || dayOfWeek === 6 ? styles["dayCell--roundRight"] : "",
          ].join(" ");
          const buttonClass = [styles.dayButton, isAnchor ? styles["dayButton--anchor"] : ""].join(" ");
          return (
            <div key={i} className={cellClass}>
              <button type="button" className={buttonClass} onClick={() => handleDayClick(day)}>
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.textButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.textButton}
          onClick={() =>
            onApply({
              start: pendingStart ? toISO(pendingStart) : "",
              end: pendingEnd ? toISO(pendingEnd) : "",
            })
          }
        >
          OK
        </button>
      </div>
    </div>
  );
}

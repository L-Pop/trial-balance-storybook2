import type { SVGProps } from "react";

/**
 * Inline icon set for the Trial Balance grid.
 *
 * These stand in for the exported Figma icon assets (Icon/Unfold, Status/Reconciled,
 * Status/Flagged, Action/More, etc.) and double as the default fill for each
 * component's INSTANCE_SWAP slots (Row.leadingSlot, Row.trailingSlot, Header
 * Cell's sort/filter glyph).
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number) {
  return { width: size, height: size, viewBox: "0 0 20 20", fill: "none" } as const;
}

/** Default (unsorted) header-cell affordance — two small chevrons. */
export function IconUnfold({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M10 4.5 13 8H7l3-3.5ZM10 15.5 7 12h6l-3 3.5Z" fill="currentColor" />
    </svg>
  );
}

/** Sorted ascending — single chevron pointing up. */
export function IconSortAscending({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M10 4.5 15 11H5l5-6.5Z" fill="currentColor" />
    </svg>
  );
}

/** Sorted descending — single chevron pointing down. */
export function IconSortDescending({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M10 15.5 5 9h10l-5 6.5Z" fill="currentColor" />
    </svg>
  );
}

/** Filter-active glyph shown on a header cell whose column has a filter applied. */
export function IconFilterActive({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path
        d="M3 4.5h14l-5.5 6.5v4l-3 1.5v-5.5L3 4.5Z"
        fill="currentColor"
      />
      <circle cx="15.5" cy="4.5" r="3" fill="var(--tbg-sys-primary, #6750a4)" stroke="var(--tbg-sys-surface,#fffbfe)" strokeWidth="1" />
    </svg>
  );
}

/** Pin glyph for a frozen/pinned column. */
export function IconPin({ size = 12, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path
        d="M11.5 2.5 15 6l-3 3v3.5l-2 2-2-2 1-1-3.5-3.5-1 1-2-2 2-2h3.5l2-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Pencil affordance shown on an editable cell. */
export function IconPencil({ size = 13, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path
        d="M4 13.5 4.4 11l7.1-7.1 2.6 2.6L7 13.6l-3 .9v0Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Inline error glyph shown on a cell with a validation problem. */
export function IconError({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path
        d="M10 2.5 18 16.5H2L10 2.5Z"
        fill="var(--tbg-sys-error, #b3261e)"
      />
      <rect x="9.25" y="8" width="1.5" height="4" fill="white" />
      <rect x="9.25" y="12.5" width="1.5" height="1.5" fill="white" />
    </svg>
  );
}

/** Trailing row action — overflow "more" affordance. */
export function IconMore({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <circle cx="4" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="16" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Leading status badge — reconciled (green check). */
export function IconStatusReconciled({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" fill="#146c2e" />
      <path d="M6 10.2 8.6 12.8 14 7.4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Leading status badge — flagged (error, needs attention). */
export function IconStatusFlagged({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" fill="var(--tbg-sys-error, #b3261e)" />
      <rect x="9.25" y="5.5" width="1.5" height="5" fill="white" />
      <rect x="9.25" y="12" width="1.5" height="1.5" fill="white" />
    </svg>
  );
}

/** Leading status badge — selected (checkbox-style fill), used on the "Selected" row variant. */
export function IconStatusSelected({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <rect x="1.5" y="1.5" width="17" height="17" rx="4" fill="var(--tbg-sys-primary, #6750a4)" />
      <path d="M5.5 10 8.5 13 14.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Neutral leading placeholder (no status). */
export function IconStatusNone({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" stroke="var(--tbg-sys-outline-variant,#cac4d0)" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

export function IconSearch({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconFilter({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M3 4.5h14l-5.5 6.5v4l-3 1.5v-5.5L3 4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconClose({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M5 5 15 15M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Calendar glyph for the toolbar's date-range control. */
export function IconCalendar({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M3 8h14M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Export/download glyph for the toolbar's export menu. */
export function IconDownload({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M10 3v9.5M6.5 9l3.5 3.5L13.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M4 15.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Settings/gear glyph for the toolbar's column-visibility menu. */
export function IconSettings({ size = 18, ...props }: IconProps) {
  // A ring of 8 rotated rectangular teeth around a hollow center, rather
  // than radiating lines — at small sizes, thin spokes around a circle read
  // as a sun/light-mode toggle, not a gear.
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props} aria-hidden="true">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="8.9"
          y="1.6"
          width="2.2"
          height="3.4"
          rx="0.6"
          fill="currentColor"
          transform={`rotate(${i * 45} 10 10)`}
        />
      ))}
    </svg>
  );
}

export function IconCheck({ size = 14, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} aria-hidden="true">
      <path d="M4 10.2 7.8 14 16 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

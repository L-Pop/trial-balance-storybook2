import type { ReactNode } from "react";

/**
 * Shared "Component Properties" contract for the Trial Balance component set,
 * mirrored from the Figma component set 1:1:
 *
 *   Boolean        — sortable, pinned, editable, selected, hasError
 *   Text           — columnLabel, cellValue
 *   Instance swap  — leadingSlot (status badge), trailingSlot (row action)
 *
 * Every component below exposes exactly the subset of this contract that its
 * Figma counterpart documents, so a Storybook control panel reads the same
 * way the Figma "Properties" panel would.
 */
export interface BooleanProperties {
  /** Shows/hides the sortable affordance (Header Cell only). */
  sortable?: boolean;
  /** Shows a pin glyph marking a frozen/pinned column (Header Cell only). */
  pinned?: boolean;
  /** Shows a pencil affordance; the cell can be typed into (Cell only). */
  editable?: boolean;
  /** Row is checked/highlighted as the current selection (Row only). */
  selected?: boolean;
  /** Shows an inline error glyph independent of the full Error variant treatment (Row + Cell). */
  hasError?: boolean;
}

/** An INSTANCE_SWAP slot: pass a Figma-component-like React node, or omit for the default. */
export type InstanceSwapSlot = ReactNode;

export type SortDirection = "none" | "ascending" | "descending";

export type RowVariant = "default" | "hover" | "selected" | "disabled" | "error";
export type HeaderCellVariant = "default" | "sorted-ascending" | "sorted-descending" | "filter-active";
export type CellVariant = "default" | "editing" | "error";
export type ToolbarVariant = "default" | "search-active" | "filters-applied";

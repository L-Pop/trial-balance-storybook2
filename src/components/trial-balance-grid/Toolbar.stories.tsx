import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toolbar } from "./Toolbar";

/**
 * Table toolbar (Figma node `33:135`). `filtersApplied` reveals the removable
 * filter-chip row and tints the filter button. `searchQuery` overrides the
 * search field's placeholder / seeds its value.
 *
 * Beyond the original Figma spec, the composed Mock Reference App Screen
 * grid has grown a few optional controls the stories below demonstrate:
 * committed multi-term search chips (`searchTerms` / `onAddSearchTerm` /
 * `onRemoveSearchTerm`, committed by pressing Enter in the search field), a
 * column-visibility settings menu (`columns` / `onToggleColumn`), an Edit
 * button (`onEdit` / `editActive`), an Export menu (`onExportPdf` /
 * `onExportExcel`), and an Accrual/Cash amount-basis toggle (`basis` /
 * `onBasisChange`). Each is omitted from the toolbar entirely unless its
 * controlling prop is passed.
 *
 * **Component Properties**
 * - Text — `searchQuery`
 * - Boolean — `filtersApplied`, `editActive`
 * - Variant — Default / Search active / Filters applied
 */
const meta = {
  title: "Trial Balance Grid/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    searchQuery: { control: "text", description: "Text property — overrides the search field placeholder/value." },
    filtersApplied: { control: "boolean", description: "Boolean property — reveals the filter-chip row and tints the filter button." },
    variant: { control: "select", options: ["default", "search-active", "filters-applied"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default" },
};

export const SearchActive: Story = {
  args: { variant: "search-active", searchQuery: "accounts rec" },
};

/** Pressing Enter in the search field commits the typed text as a removable chip, letting customers stack several terms. */
export const MultipleSearchTerms: Story = {
  name: "Multiple search terms (committed chips)",
  args: { variant: "search-active", searchTerms: ["cash", "payable"] },
};

export const FiltersApplied: Story = {
  args: {
    variant: "filters-applied",
    filtersApplied: true,
    filters: [
      { label: "All accounts" },
      { label: "Assets", active: true },
      { label: "Liabilities" },
      { label: "Equity" },
      { label: "Revenue", active: true },
      { label: "Expenses" },
    ],
  },
};

/** Passing `columns` shows the settings (gear) button, opening a menu to toggle column visibility. */
export const ColumnVisibility: Story = {
  name: "Column visibility (settings)",
  args: {
    variant: "default",
    columns: [
      { key: "debit", label: "Debit", visible: true },
      { key: "credit", label: "Credit", visible: true },
      { key: "notes", label: "Notes", visible: false },
      { key: "ref", label: "Ref #", visible: true },
    ],
  },
};

/** The Edit button only renders when `onEdit` is passed — omit it to hide the control entirely. */
export const EditButton: Story = {
  args: { variant: "default", onEdit: () => {} },
};

export const EditButtonActive: Story = {
  name: "Edit button (active)",
  args: { variant: "default", onEdit: () => {}, editActive: true },
};

/** The Export button/menu only renders when at least one of `onExportPdf` / `onExportExcel` is passed. */
export const Export: Story = {
  args: { variant: "default", onExportPdf: () => {}, onExportExcel: () => {} },
};

/** The Accrual/Cash toggle only renders when `onBasisChange` is passed; `basis` selects which side reads active. */
export const AccountingBasisToggle: Story = {
  name: "Accounting basis toggle (Accrual/Cash)",
  args: { variant: "default", basis: "cash", onBasisChange: () => {} },
};

export const Playground: Story = {
  args: { variant: "default", searchQuery: "", filtersApplied: false },
};

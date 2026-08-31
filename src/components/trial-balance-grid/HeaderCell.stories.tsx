import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeaderCell } from "./HeaderCell";

/**
 * Column header cell (Figma node `30:44`). `sortable` shows/hides the sort
 * icon; `pinned` shows a pin glyph for a frozen column; the icon slot swaps
 * between unfold / ascending / descending / filter glyphs — an
 * INSTANCE_SWAP in Figma, modeled here as the `variant` prop.
 *
 * **Component Properties**
 * - Text — `columnLabel`
 * - Boolean — `sortable`, `pinned`
 * - Instance swap — the trailing icon (unfold / sort-asc / sort-desc / filter)
 * - Variant — Default / Sorted ascending / Sorted descending / Filter active
 */
const meta = {
  title: "Trial Balance Grid/Header Cell",
  component: HeaderCell,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    columnLabel: { control: "text", description: "Text property — the column label." },
    sortable: { control: "boolean", description: "Boolean property — shows/hides the sort affordance." },
    pinned: { control: "boolean", description: "Boolean property — shows a pin glyph for a frozen column." },
    variant: { control: "select", options: ["default", "sorted-ascending", "sorted-descending", "filter-active"] },
    align: { control: "select", options: ["start", "end"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220, background: "#f3edf7", borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { columnLabel: "Account Name", sortable: true, variant: "default" },
};

export const SortedAscending: Story = {
  args: { columnLabel: "Debit", sortable: true, align: "end", variant: "sorted-ascending" },
};

export const SortedDescending: Story = {
  args: { columnLabel: "Credit", sortable: true, align: "end", variant: "sorted-descending" },
};

export const FilterActive: Story = {
  args: { columnLabel: "Notes", sortable: false, variant: "filter-active" },
};

/** `pinned` marks the column that stays frozen at narrower viewports. */
export const Pinned: Story = {
  args: { columnLabel: "Account Name", sortable: true, pinned: true, variant: "default" },
};

/** A non-sortable, non-pinned header — just the label. */
export const NotSortable: Story = {
  args: { columnLabel: "Ref #", sortable: false },
};

export const Playground: Story = {
  args: { columnLabel: "Account Name", sortable: true, pinned: false, variant: "default", align: "start" },
};

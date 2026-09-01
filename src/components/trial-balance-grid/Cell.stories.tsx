import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cell } from "./Cell";

/**
 * Generic grid cell (Figma node `28:26`). minWidth 72 / maxWidth 220 — text
 * truncates with an ending ellipsis past maxWidth. `editable` shows a pencil
 * affordance; `hasError` shows an inline error glyph *independent* of the
 * `error` variant's full container/label treatment.
 *
 * **Component Properties**
 * - Text — `cellValue`, `tooltip`
 * - Boolean — `editable`, `hasError`
 * - Variant — Default / Editing / Error
 */
const meta = {
  title: "Trial Balance Grid/Cell",
  component: Cell,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    cellValue: { control: "text", description: "Text property — the value displayed in the cell." },
    editable: { control: "boolean", description: "Boolean property — shows a pencil affordance." },
    hasError: { control: "boolean", description: "Boolean property — inline error glyph, independent of the Error variant." },
    tooltip: { control: "text", description: "Text property — shown in a hover/focus tooltip, used by the composed grid to explain a negative-balance or error cell." },
    variant: { control: "select", options: ["default", "editing", "error"] },
    tone: { control: "select", options: ["default", "positive", "negative"] },
    align: { control: "select", options: ["start", "end"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220, border: "1px dashed #cac4d0", borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The baseline cell — plain text value, no affordances. */
export const Default: Story = {
  args: { cellValue: "18,900.00", variant: "default" },
};

/** Clicking/tabbing into the cell reveals a live text input (pencil hidden while active). */
export const Editing: Story = {
  args: { cellValue: "18,900.00", editable: true, variant: "editing" },
};

/** Full error treatment — error-container background + on-error-container label color. */
export const ErrorState: Story = {
  name: "Error",
  args: { cellValue: "(3,150.00)", hasError: true, variant: "error" },
};

/** `editable` as an independent boolean — pencil affordance without entering the Editing variant. */
export const Editable: Story = {
  args: { cellValue: "45,230.00", editable: true, variant: "default" },
};

/** `hasError` as an independent boolean — the small error glyph shows even in the Default variant. */
export const HasErrorBadgeOnly: Story = {
  name: "hasError (independent of Error variant)",
  args: { cellValue: "8,200.00", hasError: true, variant: "default" },
};

/** Numeric tone helpers used by the composed grid for credit-favorable / unfavorable amounts. */
export const PositiveValue: Story = {
  args: { cellValue: "12,400.00", tone: "positive", align: "end" },
};

export const NegativeValue: Story = {
  args: { cellValue: "(3,150.00)", tone: "negative", align: "end" },
};

/** Long text truncates with an ellipsis once it exceeds the 220px maxWidth. */
export const TruncatedText: Story = {
  args: { cellValue: "Accumulated Depreciation — Office Equipment (Building B)" },
};

/** `tooltip` — used by the composed grid on negative-balance cells to explain why the amount is in parentheses. Hover or focus the cell to reveal it. */
export const WithTooltip: Story = {
  name: "Tooltip (hover/focus)",
  args: {
    cellValue: "(3,150.00)",
    tone: "negative",
    align: "end",
    tooltip:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

/** Playground — every control wired up. */
export const Playground: Story = {
  args: { cellValue: "45,230.00", editable: false, hasError: false, variant: "default", tone: "default", align: "start" },
};

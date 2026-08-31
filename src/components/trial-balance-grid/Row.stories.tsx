import type { Meta, StoryObj } from "@storybook/react-vite";
import { Row } from "./Row";
import { Cell } from "./Cell";
import { IconMore, IconPin, IconStatusFlagged, IconStatusNone, IconStatusReconciled, IconStatusSelected } from "./icons/Icons";

/**
 * Grid row composed of Cell instances (Figma node `31:245`). `selected` and
 * `hasError` toggle small inline badges *independent* of the full variant
 * treatment. Leading Status and Trailing Action are INSTANCE_SWAP slots.
 *
 * **Component Properties**
 * - Boolean — `selected`, `hasError`
 * - Instance swap — `leadingSlot` (status badge), `trailingSlot` (row action)
 * - Variant — Default / Hover / Selected / Disabled (read-only) / Error
 */
const meta = {
  title: "Trial Balance Grid/Row",
  component: Row,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "select", options: ["default", "hover", "selected", "disabled", "error"] },
    selected: { control: "boolean", description: "Boolean property — independent 'selected' badge." },
    hasError: { control: "boolean", description: "Boolean property — independent inline error badge." },
    zebra: { control: "boolean" },
    leadingSlot: {
      control: "select",
      options: ["reconciled", "flagged", "selected", "none"],
      mapping: {
        reconciled: <IconStatusReconciled />,
        flagged: <IconStatusFlagged />,
        selected: <IconStatusSelected />,
        none: <IconStatusNone />,
      },
      description: "Instance-swap slot — leading status badge.",
    },
    trailingSlot: {
      control: "select",
      options: ["more", "pin", "none"],
      mapping: {
        more: <IconMore />,
        pin: <IconPin size={16} />,
        none: null,
      },
      description: "Instance-swap slot — trailing row action.",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640, border: "1px solid #cac4d0", borderRadius: 12, overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

function toneFor(value: string): "default" | "positive" | "negative" {
  if (value === "—" || value === "") return "default";
  return value.trim().startsWith("(") ? "negative" : "positive";
}

function threeCells(a: string, b: string, c: string) {
  return (
    <>
      <Cell cellValue={a} />
      <Cell cellValue={b} align="end" tone={toneFor(b)} />
      <Cell cellValue={c} align="end" tone={toneFor(c)} />
    </>
  );
}

export const Default: Story = {
  args: { variant: "default", children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const Hover: Story = {
  args: { variant: "hover", children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const Selected: Story = {
  args: { variant: "selected", leadingSlot: <IconStatusSelected />, children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const DisabledReadOnly: Story = {
  name: "Disabled / Read-only",
  args: { variant: "disabled", leadingSlot: <IconStatusNone />, children: threeCells("Suspense Account", "0.00", "—") },
};

export const ErrorState: Story = {
  name: "Error",
  args: { variant: "error", leadingSlot: <IconStatusFlagged />, children: threeCells("Utilities — Overdue", "—", "(3,150.00)") },
};

/** `selected` + `hasError` render as small inline badges even though the row is otherwise Default. */
export const IndependentBadges: Story = {
  name: "selected / hasError badges (independent of variant)",
  args: { variant: "default", selected: true, hasError: true, children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const ZebraPair: Story = {
  name: "Zebra striping (default variant only)",
  render: (args) => (
    <div>
      <Row {...args} zebra={false}>
        {threeCells("Cash", "45,230.00", "—")}
      </Row>
      <Row {...args} zebra={true}>
        {threeCells("Accounts Receivable", "18,900.00", "—")}
      </Row>
    </div>
  ),
  args: { variant: "default", children: threeCells("Cash", "45,230.00", "—") },
};

export const Playground: Story = {
  args: { variant: "default", selected: false, hasError: false, zebra: false, children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

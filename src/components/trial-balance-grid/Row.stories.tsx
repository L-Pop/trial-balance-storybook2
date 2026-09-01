import type { Meta, StoryObj } from "@storybook/react-vite";
import { Row } from "./Row";
import { Cell } from "./Cell";
import { IconMore, IconPin } from "./icons/Icons";
import gridStyles from "./TrialBalanceGrid.module.css";

/** Matches the row-select radio used in the composed Mock Reference App Screen grid. */
function selectRadio(checked: boolean, disabled = false) {
  return (
    <input
      type="radio"
      name="row-story"
      className={gridStyles.selectRadio}
      defaultChecked={checked}
      disabled={disabled}
      aria-label="Select row"
    />
  );
}

/**
 * Grid row composed of Cell instances (Figma node `31:245`). `selected` and
 * `hasError` toggle small inline badges *independent* of the full variant
 * treatment. Leading Status and Trailing Action are INSTANCE_SWAP slots —
 * the composed grid fills Leading Status with a select radio (its `checked`
 * state reflects selection directly, independent of `variant`, so a
 * warning/error row can be selected without its icon or background changing).
 *
 * **Component Properties**
 * - Boolean — `selected`, `hasError`
 * - Instance swap — `leadingSlot` (select radio), `trailingSlot` (row action)
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
      options: ["unchecked", "checked", "disabled"],
      mapping: {
        unchecked: selectRadio(false),
        checked: selectRadio(true),
        disabled: selectRadio(false, true),
      },
      description: "Instance-swap slot — the row-select radio.",
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
  args: { variant: "default", leadingSlot: selectRadio(false), children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const Hover: Story = {
  args: { variant: "hover", leadingSlot: selectRadio(false), children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const Selected: Story = {
  args: { variant: "selected", leadingSlot: selectRadio(true), children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const DisabledReadOnly: Story = {
  name: "Disabled / Read-only",
  args: { variant: "disabled", leadingSlot: selectRadio(false, true), children: threeCells("Suspense Account", "0.00", "—") },
};

/** A warning/error row keeps its radio checkable and, once selected, its checked state — the row's error styling never swaps out for the "selected" variant treatment. */
export const ErrorState: Story = {
  name: "Error",
  args: { variant: "error", leadingSlot: selectRadio(false), children: threeCells("Utilities — Overdue", "—", "(3,150.00)") },
};

/** `selected` + `hasError` render as small inline badges even though the row is otherwise Default. */
export const IndependentBadges: Story = {
  name: "selected / hasError badges (independent of variant)",
  args: { variant: "default", selected: true, hasError: true, leadingSlot: selectRadio(false), children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

export const ZebraPair: Story = {
  name: "Zebra striping (default variant only)",
  render: (args) => (
    <div>
      <Row {...args} zebra={false} leadingSlot={selectRadio(false)}>
        {threeCells("Cash", "45,230.00", "—")}
      </Row>
      <Row {...args} zebra={true} leadingSlot={selectRadio(false)}>
        {threeCells("Accounts Receivable", "18,900.00", "—")}
      </Row>
    </div>
  ),
  args: { variant: "default", children: threeCells("Cash", "45,230.00", "—") },
};

export const Playground: Story = {
  args: { variant: "default", selected: false, hasError: false, zebra: false, leadingSlot: selectRadio(false), children: threeCells("Accounts Receivable", "18,900.00", "—") },
};

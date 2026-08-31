import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrialBalanceGrid } from "./TrialBalanceGrid";

/**
 * The mock reference-app screen: a "Ledger" app bar + Toolbar + full Trial
 * Balance grid, composed entirely from Row / Header Cell / Cell / Toolbar.
 *
 * This is the responsive-behavior demo. Column collapse order, as width
 * shrinks:
 *
 * 1. Nothing — desktop (≥ 900px) shows every column inline.
 * 2. **Notes hides first** once the tablet band gets tight (< 780px), the
 *    least-critical column for a quick balance check.
 * 3. **Account Name (+ leading status + trailing action) freezes** and the
 *    remaining columns (Debit / Credit / Notes / Ref #) scroll horizontally
 *    beneath it — the identity column and row actions always stay visible.
 * 4. **Below 640px the grid becomes a stacked card list** — one card per
 *    account, label/value pairs instead of grid columns.
 *
 * Use the viewport toolbar above the canvas (three custom presets match the
 * Figma reference frames exactly: 1280 / 744 / 390) or the **Resizable
 * Container** story below to see the collapse live.
 */
const meta = {
  title: "Trial Balance Grid/Mock Reference App Screen",
  component: TrialBalanceGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    showLayoutBadge: { control: "boolean" },
  },
} satisfies Meta<typeof TrialBalanceGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  args: { showLayoutBadge: true },
};

/** Pinned to the 1280px Figma reference frame — all columns visible inline. */
export const DesktopViewport: Story = {
  args: { showLayoutBadge: true },
  parameters: { viewport: { defaultViewport: "tbgDesktop" } },
};

/** Pinned to the 744px Figma reference frame — Account Name frozen, remaining columns scroll horizontally. */
export const TabletViewport: Story = {
  args: { showLayoutBadge: true },
  parameters: { viewport: { defaultViewport: "tbgTablet" } },
};

/** Pinned to the 390px Figma reference frame — stacked card fallback. */
export const MobileViewport: Story = {
  args: { showLayoutBadge: true },
  parameters: { viewport: { defaultViewport: "tbgMobile" } },
};

/**
 * Drag the bottom-right corner of the frame to resize it and watch the grid
 * collapse live — useful when the viewport toolbar isn't handy. Layout is
 * measured from the component's own rendered width, so this behaves exactly
 * like resizing the browser window.
 */
export const ResizableContainer: Story = {
  args: { showLayoutBadge: true },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div
        style={{
          resize: "horizontal",
          overflow: "auto",
          width: "900px",
          minWidth: "360px",
          maxWidth: "1280px",
          height: "640px",
          border: "2px dashed #6750a4",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

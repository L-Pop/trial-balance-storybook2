import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toolbar } from "./Toolbar";

/**
 * Table toolbar (Figma node `33:135`). `filtersApplied` reveals the removable
 * filter-chip row and tints the filter button. `searchQuery` overrides the
 * search field's placeholder / seeds its value.
 *
 * **Component Properties**
 * - Text — `searchQuery`
 * - Boolean — `filtersApplied`
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

export const Playground: Story = {
  args: { variant: "default", searchQuery: "", filtersApplied: false },
};

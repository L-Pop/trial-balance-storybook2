import type { Preview } from "@storybook/react-vite";

import "../src/components/trial-balance-grid/tokens.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        desktop1280: {
          name: "Desktop — 1280",
          styles: { width: "1280px", height: "900px" },
          type: "desktop",
        },
        tablet744: {
          name: "Tablet — 744",
          styles: { width: "744px", height: "1024px" },
          type: "tablet",
        },
        mobile390: {
          name: "Mobile — 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
      },
    },
  },
};

export default preview;

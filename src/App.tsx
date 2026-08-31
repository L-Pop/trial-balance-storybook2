import { TrialBalanceGrid } from "./components/trial-balance-grid/TrialBalanceGrid";
import "./components/trial-balance-grid/tokens.css";

/**
 * Standalone preview of the Trial Balance grid outside Storybook.
 * Run `npm run dev` and resize the browser window to see the same
 * responsive collapse demonstrated in the Storybook stories.
 */
function App() {
  return <TrialBalanceGrid showLayoutBadge />;
}

export default App;

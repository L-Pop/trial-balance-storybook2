import type { RowVariant } from "./types";

export type AccountCategory = "assets" | "liabilities" | "equity" | "revenue" | "expenses";
export type AccountStatus = "reconciled" | "flagged" | "none";

export interface TrialBalanceAccount {
  id: string;
  acctNumber: string;
  name: string;
  category: AccountCategory;
  debit: string;
  credit: string;
  notes: string;
  refNumber: string;
  status: AccountStatus;
  /** Forces a specific Row variant regardless of interaction state (used for the disabled/error demo rows). */
  forcedVariant?: Extract<RowVariant, "disabled" | "error">;
}

export const sampleAccounts: TrialBalanceAccount[] = [
  { id: "1000", acctNumber: "1000", name: "Cash", category: "assets", debit: "45,230.00", credit: "—", notes: "Operating account", refNumber: "1001", status: "reconciled" },
  { id: "1100", acctNumber: "1100", name: "Accounts Receivable", category: "assets", debit: "18,900.00", credit: "—", notes: "Net 30", refNumber: "1042", status: "reconciled" },
  { id: "1200", acctNumber: "1200", name: "Inventory", category: "assets", debit: "32,450.00", credit: "—", notes: "FIFO", refNumber: "1050", status: "reconciled" },
  { id: "1400", acctNumber: "1400", name: "Prepaid Insurance", category: "assets", debit: "3,600.00", credit: "—", notes: "12-mo policy", refNumber: "1061", status: "reconciled" },
  { id: "1500", acctNumber: "1500", name: "Equipment", category: "assets", debit: "85,000.00", credit: "—", notes: "5-yr depreciation", refNumber: "1075", status: "reconciled" },
  { id: "1900", acctNumber: "1900", name: "Suspense Account", category: "assets", debit: "0.00", credit: "—", notes: "Pending review", refNumber: "1099", status: "none", forcedVariant: "disabled" },
  { id: "2000", acctNumber: "2000", name: "Accounts Payable", category: "liabilities", debit: "—", credit: "8,200.00", notes: "Auto-pay", refNumber: "1043", status: "reconciled" },
  { id: "2100", acctNumber: "2100", name: "Accrued Liabilities", category: "liabilities", debit: "—", credit: "5,600.00", notes: "Payroll accrual", refNumber: "1088", status: "reconciled" },
  { id: "2150", acctNumber: "2150", name: "Utilities — Overdue", category: "liabilities", debit: "—", credit: "(3,150.00)", notes: "Past due 45 days", refNumber: "1045", status: "flagged", forcedVariant: "error" },
  { id: "2200", acctNumber: "2200", name: "Notes Payable", category: "liabilities", debit: "—", credit: "40,000.00", notes: "Equipment loan", refNumber: "1090", status: "reconciled" },
  { id: "3000", acctNumber: "3000", name: "Common Stock", category: "equity", debit: "—", credit: "50,000.00", notes: "Founders", refNumber: "1005", status: "reconciled" },
  { id: "3100", acctNumber: "3100", name: "Retained Earnings", category: "equity", debit: "—", credit: "28,760.00", notes: "Prior year", refNumber: "1006", status: "reconciled" },
  { id: "4000", acctNumber: "4000", name: "Sales Revenue", category: "revenue", debit: "—", credit: "210,500.00", notes: "Q3 bookings", refNumber: "1112", status: "reconciled" },
  { id: "5000", acctNumber: "5000", name: "Office Supplies Expense", category: "expenses", debit: "3,000.00", credit: "—", notes: "Reorder soon", refNumber: "1044", status: "reconciled" },
];

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
  /** Debit amount under cash-basis accounting, if it differs from the (accrual) `debit` above. Falls back to `debit` when omitted. */
  cashDebit?: string;
  /** Credit amount under cash-basis accounting, if it differs from the (accrual) `credit` above. Falls back to `credit` when omitted. */
  cashCredit?: string;
  notes: string;
  refNumber: string;
  status: AccountStatus;
  /** Forces a specific Row variant regardless of interaction state (used for the disabled/error demo rows). */
  forcedVariant?: Extract<RowVariant, "disabled" | "error">;
}

export const sampleAccounts: TrialBalanceAccount[] = [
  { id: "1000", acctNumber: "48213", name: "Cash", category: "assets", debit: "45,230.00", credit: "—", notes: "Operating account", refNumber: "1001", status: "reconciled" },
  { id: "1100", acctNumber: "62957", name: "Accounts Receivable", category: "assets", debit: "18,900.00", cashDebit: "—", credit: "—", notes: "Net 30", refNumber: "1042", status: "reconciled" },
  { id: "1200", acctNumber: "31084", name: "Inventory", category: "assets", debit: "32,450.00", credit: "—", notes: "FIFO", refNumber: "1050", status: "reconciled" },
  { id: "1400", acctNumber: "75629", name: "Prepaid Insurance", category: "assets", debit: "3,600.00", cashDebit: "—", credit: "—", notes: "12-mo policy", refNumber: "1061", status: "reconciled" },
  { id: "1500", acctNumber: "19468", name: "Equipment", category: "assets", debit: "85,000.00", credit: "—", notes: "5-yr depreciation", refNumber: "1075", status: "reconciled" },
  { id: "1900", acctNumber: "84032", name: "Suspense Account", category: "assets", debit: "0.00", credit: "—", notes: "Pending review", refNumber: "1099", status: "none", forcedVariant: "disabled" },
  { id: "2000", acctNumber: "56710", name: "Accounts Payable", category: "liabilities", debit: "—", credit: "8,200.00", cashCredit: "—", notes: "Auto-pay", refNumber: "1043", status: "reconciled" },
  { id: "2100", acctNumber: "29845", name: "Accrued Liabilities", category: "liabilities", debit: "—", credit: "5,600.00", cashCredit: "—", notes: "Payroll accrual", refNumber: "1088", status: "reconciled" },
  { id: "2150", acctNumber: "67391", name: "Utilities — Overdue", category: "liabilities", debit: "—", credit: "(3,150.00)", cashCredit: "—", notes: "Past due 45 days", refNumber: "1045", status: "flagged", forcedVariant: "error" },
  { id: "2200", acctNumber: "40258", name: "Notes Payable", category: "liabilities", debit: "—", credit: "40,000.00", notes: "Equipment loan", refNumber: "1090", status: "reconciled" },
  { id: "3000", acctNumber: "83506", name: "Common Stock", category: "equity", debit: "—", credit: "50,000.00", notes: "Founders", refNumber: "1005", status: "reconciled" },
  { id: "3100", acctNumber: "17924", name: "Retained Earnings", category: "equity", debit: "—", credit: "28,760.00", notes: "Prior year", refNumber: "1006", status: "reconciled" },
  { id: "4000", acctNumber: "95183", name: "Sales Revenue", category: "revenue", debit: "—", credit: "210,500.00", cashCredit: "191,600.00", notes: "Q3 bookings", refNumber: "1112", status: "reconciled" },
  { id: "5000", acctNumber: "52679", name: "Office Supplies Expense", category: "expenses", debit: "3,000.00", credit: "—", notes: "Reorder soon", refNumber: "1044", status: "reconciled" },
];

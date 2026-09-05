import type { LendingTransaction, Person, PersonLedger, LedgerDirection } from "./lending-types";

/** Builds the full ledger (totals + direction) for a single person. */
export function getPersonLedger(personId: string, transactions: LendingTransaction[]): PersonLedger {
  const txns = transactions
    .filter((t) => t.personId === personId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));

  let lentTotal = 0;
  let receivedTotal = 0;
  let borrowedTotal = 0;
  let repaidTotal = 0;

  for (const t of txns) {
    if (t.type === "lend") lentTotal += t.amount;
    else if (t.type === "receive") receivedTotal += t.amount;
    else if (t.type === "borrow") borrowedTotal += t.amount;
    else if (t.type === "repay") repaidTotal += t.amount;
  }

  const net = lentTotal - receivedTotal - (borrowedTotal - repaidTotal);
  const direction: LedgerDirection = net > 0.004 ? "they_owe_me" : net < -0.004 ? "i_owe_them" : "settled";

  return {
    transactions: txns,
    lentTotal,
    receivedTotal,
    borrowedTotal,
    repaidTotal,
    outstanding: Math.abs(net),
    direction,
  };
}

/** Aggregates every person into totals + grouped lists for the People landing page. */
export function getOverallLendingSummary(people: Person[], transactions: LendingTransaction[]) {
  let totalOwedToMe = 0;
  let totalIOwe = 0;

  const rows = people.map((person) => {
    const ledger = getPersonLedger(person.id, transactions);
    if (ledger.direction === "they_owe_me") totalOwedToMe += ledger.outstanding;
    if (ledger.direction === "i_owe_them") totalIOwe += ledger.outstanding;
    return { person, ledger };
  });

  return {
    totalOwedToMe,
    totalIOwe,
    rows,
    lenders: rows.filter((r) => r.ledger.direction === "they_owe_me"),
    borrowers: rows.filter((r) => r.ledger.direction === "i_owe_them"),
    // "Settled" = balance is back to zero after prior activity.
    settled: rows.filter((r) => r.ledger.direction === "settled" && r.ledger.transactions.length > 0),
    // "No activity yet" = a person was added but no lend/borrow has been recorded at all.
    // Without this bucket these people never appear in lenders/borrowers/settled and are invisible.
    noActivity: rows.filter((r) => r.ledger.transactions.length === 0),
  };
}

function csvEscape(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** People tab -> "Export CSV": one row per person with current balance. */
export function exportPeopleSummaryCSV(people: Person[], transactions: LendingTransaction[]) {
  const rows: (string | number)[][] = [["Name", "Contact", "Direction", "Outstanding"]];
  for (const person of people) {
    const ledger = getPersonLedger(person.id, transactions);
    const label =
      ledger.direction === "they_owe_me" ? "Owes me" : ledger.direction === "i_owe_them" ? "I owe" : "Settled";
    rows.push([person.name, person.contact ?? "", label, ledger.outstanding.toFixed(2)]);
  }
  downloadCSV("people-balances.csv", rows);
}

/** Person detail page -> "Export CSV": full timeline + a trailing outstanding total row. */
export function exportPersonTimelineCSV(person: Person, ledger: PersonLedger) {
  const rows: (string | number)[][] = [["Date", "Type", "Amount", "Due date", "Note"]];
  for (const t of ledger.transactions) {
    rows.push([t.date, t.type, t.amount.toFixed(2), t.dueDate ?? "", t.note ?? ""]);
  }
  rows.push([]);
  const label =
    ledger.direction === "they_owe_me"
      ? `${person.name} owes you`
      : ledger.direction === "i_owe_them"
      ? `You owe ${person.name}`
      : "Settled";
  rows.push(["Outstanding", label, ledger.outstanding.toFixed(2)]);
  downloadCSV(`${person.name.replace(/\s+/g, "-").toLowerCase()}-timeline.csv`, rows);
}

/**
 * Shares (mobile) or downloads (desktop) a PNG snapshot of a DOM node — same
 * pattern as the existing ShareButton, using html-to-image. Swap this out for
 * your existing ShareButton component if its prop signature covers this case.
 */
export async function shareOrDownloadPng(node: HTMLElement, filename: string, shareTitle?: string) {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#09090b" });

  if (typeof navigator !== "undefined" && "share" in navigator && "canShare" in navigator) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: shareTitle });
        return;
      }
    } catch {
      // fall through to download
    }
  }

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

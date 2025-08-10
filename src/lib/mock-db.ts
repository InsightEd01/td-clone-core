// Lightweight local storage mock DB for demo flows
// Data is stored under a single root key for easy reset/inspect

export type Account = {
  id: string;
  name: string;
  balance: number; // stored as number in dollars
};

export type Transaction = {
  id: string;
  type: "send" | "transfer" | "bill" | "deposit";
  amount: number; // positive for credit, negative for debit
  fromAccountId?: string;
  toAccountId?: string;
  counterparty?: string; // email/phone or payee name
  note?: string;
  createdAt: string; // ISO
};

export type Payee = { id: string; name: string; accountNumber: string };
export type Recipient = { id: string; name: string; contact: string };

type DB = {
  accounts: Account[];
  transactions: Transaction[];
  payees: Payee[];
  recipients: Recipient[];
};

const KEY = "greenbank.db.v1";

function seed(): DB {
  const db: DB = {
    accounts: [
      { id: "chq", name: "Unlimited Chequing", balance: 1490.12 },
      { id: "svg", name: "Every Day Savings", balance: 167.82 },
    ],
    transactions: [],
    payees: [
      { id: "hydro", name: "City Hydro", accountNumber: "00012345" },
      { id: "visa", name: "Visa Card", accountNumber: "4111 1111" },
    ],
    recipients: [
      { id: "jay", name: "Jayden", contact: "jayden@example.com" },
      { id: "amy", name: "Amy", contact: "+1 (555) 123-9876" },
    ],
  };
  localStorage.setItem(KEY, JSON.stringify(db));
  return db;
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as DB;
  } catch {
    return seed();
  }
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const mockdb = {
  reset: () => seed(),
  getAccounts: (): Account[] => load().accounts,
  getTransactions: (): Transaction[] => load().transactions,
  getPayees: (): Payee[] => load().payees,
  getRecipients: (): Recipient[] => load().recipients,

  sendMoney: (fromAccountId: string, recipient: Recipient | { name: string; contact: string }, amount: number, note?: string) => {
    const db = load();
    const from = db.accounts.find(a => a.id === fromAccountId);
    if (!from) throw new Error("From account not found");
    if (amount <= 0) throw new Error("Amount must be positive");
    if (from.balance < amount) throw new Error("Insufficient funds");

    from.balance = +(from.balance - amount).toFixed(2);

    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "send",
      amount: -amount,
      fromAccountId,
      counterparty: recipient.contact,
      note: note || `Send to ${recipient.contact}`,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    // store recipient if new
    if (!("id" in recipient)) {
      db.recipients.unshift({ id: crypto.randomUUID(), name: recipient.name || recipient.contact, contact: recipient.contact });
    }

    save(db);
    return tx;
  },

  transfer: (fromAccountId: string, toAccountId: string, amount: number, note?: string) => {
    if (fromAccountId === toAccountId) throw new Error("Accounts must be different");
    const db = load();
    const from = db.accounts.find(a => a.id === fromAccountId);
    const to = db.accounts.find(a => a.id === toAccountId);
    if (!from || !to) throw new Error("Account not found");
    if (amount <= 0) throw new Error("Amount must be positive");
    if (from.balance < amount) throw new Error("Insufficient funds");

    from.balance = +(from.balance - amount).toFixed(2);
    to.balance = +(to.balance + amount).toFixed(2);

    const txOut: Transaction = {
      id: crypto.randomUUID(),
      type: "transfer",
      amount: -amount,
      fromAccountId,
      toAccountId,
      note: note || `Transfer to ${to.name}`,
      createdAt: new Date().toISOString(),
    };
    const txIn: Transaction = {
      id: crypto.randomUUID(),
      type: "transfer",
      amount: amount,
      fromAccountId,
      toAccountId,
      note: note || `Transfer from ${from.name}`,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(txOut);
    db.transactions.unshift(txIn);

    save(db);
    return { txOut, txIn };
  },

  payBill: (fromAccountId: string, payeeId: string, amount: number, note?: string) => {
    const db = load();
    const from = db.accounts.find(a => a.id === fromAccountId);
    const payee = db.payees.find(p => p.id === payeeId);
    if (!from || !payee) throw new Error("Account or payee not found");
    if (amount <= 0) throw new Error("Amount must be positive");
    if (from.balance < amount) throw new Error("Insufficient funds");

    from.balance = +(from.balance - amount).toFixed(2);

    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "bill",
      amount: -amount,
      fromAccountId,
      counterparty: payee.name,
      note: note || `Bill payment to ${payee.name}`,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    save(db);
    return tx;
  },

  deposit: (toAccountId: string, amount: number, note?: string) => {
    const db = load();
    const to = db.accounts.find(a => a.id === toAccountId);
    if (!to) throw new Error("Account not found");
    if (amount <= 0) throw new Error("Amount must be positive");

    to.balance = +(to.balance + amount).toFixed(2);

    const tx: Transaction = {
      id: crypto.randomUUID(),
      type: "deposit",
      amount: amount,
      toAccountId,
      note: note || `Mobile deposit`,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    save(db);
    return tx;
  },

  addPayee: (name: string, accountNumber: string) => {
    const db = load();
    const payee: Payee = { id: crypto.randomUUID(), name, accountNumber };
    db.payees.unshift(payee);
    save(db);
    return payee;
  },
};

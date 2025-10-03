export interface BaseEvent {
  transactionId: string;
  timestamp?: Date;
}

export interface TransactionInitiated extends BaseEvent {
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  userId: string;
}

export interface FundsReserved extends BaseEvent {
  ok: boolean;
  holdId: string;
  amount: number;
}

export interface FraudChecked extends BaseEvent {
  risk: 'LOW' | 'HIGH';
}

export interface Committed extends BaseEvent {
  ledgerTxId: string;
}

export interface Reversed extends BaseEvent {
  reason: string;
}

export interface Notified extends BaseEvent {
  channels: string[];
}

export type TransactionEvent =
  | TransactionInitiated
  | FundsReserved
  | FraudChecked
  | Committed
  | Reversed
  | Notified;
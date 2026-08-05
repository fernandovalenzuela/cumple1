// app/onboarding/payment/mock/mercadopago/MockPaymentStore.ts

export type MockPaymentStatus =
  | "approved"
  | "rejected"
  | "pending";

export interface MockPayment {

  id: string;

  checkoutId: string;

  transactionId: string;

  externalReference: string;

  status: MockPaymentStatus;

  transactionAmount: number;

  currencyId: string;

  description: string;

  notificationUrl: string;

  successUrl: string;

  failureUrl: string;

  pendingUrl: string;

  createdAt: Date;

  approvedAt: Date | null;

}

const payments = new Map<string, MockPayment>();

export function savePayment(payment: MockPayment): void {
console.log("MockPaymentStore.savePayment payment.id ", payment.id);
  payments.set(payment.id, payment);

}

export function getPayment(id: string): MockPayment {
console.log("MockPaymentStore.getPayment id ", id);
  const payment = payments.get(id);

  if (!payment) {
    throw new Error(`Mock payment '${id}' not found.`);
  }

  return payment;

}

export function updatePayment(
  id: string,
  status: MockPaymentStatus
): MockPayment {

  const payment = getPayment(id);

  payment.status = status;

  payment.approvedAt =
    status === "approved"
      ? new Date()
      : null;

  payments.set(id, payment);

  return payment;

}

export function getPaymentByCheckoutId(
  checkoutId: string
): MockPayment {
console.log("MockPaymentStore.getPaymentByCheckoutId checkoutId ", checkoutId);
  const payment = [...payments.values()].find(
    payment => payment.checkoutId === checkoutId
  );

  if (!payment) {
    throw new Error(
      `Mock checkout '${checkoutId}' not found.`
    );
  }

  return payment;

}

export function clearPayments(): void {

  payments.clear();

}
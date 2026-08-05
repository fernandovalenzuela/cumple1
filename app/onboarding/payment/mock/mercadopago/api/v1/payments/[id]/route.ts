// app/onboarding/payment/mock/mercadopago/api/v1/payments/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/onboarding/payment/mock/mercadopago/MockPaymentStore";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {

  const { id } = await params;

  const payment = getPayment(id);

  console.log("## app\onboarding\payment\mock\mercadopago\api\v1\payments\[id]\route.ts payment ", payment);

  return NextResponse.json({
    id: payment.id,
    date_created: payment.createdAt.toISOString(),
    date_approved:
      payment.approvedAt?.toISOString() ?? null,
    date_last_updated: new Date().toISOString(),
    money_release_date: null,
    payment_method_id: "visa",
    payment_type_id: "credit_card",
    status: payment.status,
    status_detail: (() => {
      switch (payment.status) {
        case "approved":
          return "accredited";
        case "pending":
          return "pending_waiting_payment";
        case "rejected":
          return "cc_rejected_other_reason";
      }
    })(),

    currency_id: payment.currencyId,
    description: payment.description,
    external_reference: payment.externalReference,
    transaction_amount: payment.transactionAmount,
    transaction_amount_refunded: 0,
    coupon_amount: 0,
    installments: 1,
    live_mode: false,
    captured: payment.status === "approved",
    binary_mode: false,
    call_for_authorize_id: null,
    statement_descriptor: null,
    notification_url: payment.notificationUrl,
    order: {
      id: payment.checkoutId,
      type: "mercadopago",
    },
    payer: {
      id: "123456789",
      email: "buyer@test.com",
    },
    collector: {
      id: 999999999,
    },
    transaction_details: {
      net_received_amount: payment.transactionAmount,
      total_paid_amount: payment.transactionAmount,
      installment_amount: payment.transactionAmount,
      financial_institution: null,
      acquirer_reference: payment.transactionId,
      transaction_id: payment.transactionId,
    },
    metadata: {},
  });

}
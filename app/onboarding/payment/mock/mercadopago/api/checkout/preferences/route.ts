// app/onboarding/payment/mock/mercadopago/api/checkout/preferences/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  MockPayment,
  savePayment,
} from "@/onboarding/payment/mock/mercadopago/MockPaymentStore";

export async function POST(request: NextRequest) {

  const body = await request.json();

  console.log("app\onboarding\payment\mock\mercadopago\api\checkout\preferences\route.ts body ", body);

  console.log("app\onboarding\payment\mock\mercadopago\api\checkout\preferences\route.ts body ", body.external_reference);

  const checkoutId = crypto.randomUUID();
  const paymentId = crypto.randomUUID();
  const transactionId = crypto.randomUUID();

  const item = body.items[0];

  const payment: MockPayment = {
    id: paymentId,
    checkoutId,
    transactionId,
    externalReference: body.external_reference,
    status: "pending",
    transactionAmount: item.unit_price,
    currencyId: item.currency_id,
    description: item.title,
    notificationUrl: body.notification_url,
    successUrl: body.back_urls.success,
    failureUrl: body.back_urls.failure,
    pendingUrl: body.back_urls.pending,
    createdAt: new Date(),
    approvedAt: null,
  };
console.log("app\onboarding\payment\mock\mercadopago\api\checkout\preferences\route.ts antes savePayment payment.id " + payment.id);
  savePayment(payment);

  return NextResponse.json({

    id: checkoutId,

    init_point:
      `http://localhost:3000/onboarding/payment/mock/mercadopago/pay?checkoutId=${checkoutId}`,

    sandbox_init_point:
      `http://localhost:3000/onboarding/payment/mock/mercadopago/pay?checkoutId=${checkoutId}`,

  });

}
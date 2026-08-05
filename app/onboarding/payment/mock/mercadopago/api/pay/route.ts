// app/onboarding/payment/mock/mercadopago/api/pay/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getPaymentByCheckoutId,
  updatePayment,
  MockPaymentStatus,
} from "@/onboarding/payment/mock/mercadopago/MockPaymentStore";

type PayRequest = {
  checkoutId: string;
  status: MockPaymentStatus;
};

export async function POST(request: NextRequest) {

  const { checkoutId, status } =
    await request.json() as PayRequest;
console.log("app\onboarding\payment\mock\mercadopago\api\pay\route.ts checkoutId ",checkoutId);
  const payment = getPaymentByCheckoutId(checkoutId);

  const updatedPayment = updatePayment(
    payment.id,
    status
  );

  console.log("## updatedPayment.notificationUrl ", updatedPayment.notificationUrl);
  console.log("## updatedPayment.id ", updatedPayment.id);

  await fetch(
    updatedPayment.notificationUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "payment.updated",
        api_version: "v1",
        type: "payment",
        data: {
          id: updatedPayment.id,
        },
      }),
    }
  );

  let redirectUrl: string;

  switch (status) {

    case "approved":
      redirectUrl = updatedPayment.successUrl;
      break;

    case "rejected":
      redirectUrl = updatedPayment.failureUrl;
      break;

    case "pending":
      redirectUrl = updatedPayment.pendingUrl;
      break;

    default:
      throw new Error(`Unsupported status '${status}'.`);

  }

  return NextResponse.json({
    redirectUrl,
  });

}

/*



import { NextRequest, NextResponse } from "next/server";

type PaymentStatus = "approved" | "rejected" | "pending";

export async function POST(request: NextRequest) {

  const { checkoutId, status } = await request.json() as {
    checkoutId: string;
    status: PaymentStatus;
  };

  const paymentId = crypto.randomUUID();
  const transactionId = crypto.randomUUID();

  //
  // Guardar el pago mock.
  // En el próximo paso implementaremos este endpoint.
  //
  await fetch(
    "http://localhost:3000/onboarding/payment/mock/mercadopago/api/internal/payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: paymentId,
        checkoutId,
        transactionId,
        status,
      }),
    }
  );

  //
  // Simular el webhook de Mercado Pago.
  //
  await fetch(
    "http://localhost:3000/onboarding/payment/webhook",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "payment.updated",
        api_version: "v1",
        type: "payment",
        data: {
          id: paymentId,
        },
      }),
    }
  );

  let redirectUrl: string;

  switch (status) {

    case "approved":
      redirectUrl =
        "http://localhost:3000/onboarding/payment/result/success";
      break;

    case "rejected":
      redirectUrl =
        "http://localhost:3000/onboarding/payment/result/failure";
      break;

    case "pending":
      redirectUrl =
        "http://localhost:3000/onboarding/payment/result/pending";
      break;

  }

  return NextResponse.json({
    redirectUrl,
  });

}*/
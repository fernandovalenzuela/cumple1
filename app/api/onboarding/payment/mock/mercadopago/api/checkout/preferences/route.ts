import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

  const body = await request.json();

  const checkoutId = crypto.randomUUID();

  return NextResponse.json({
    id: checkoutId,

    init_point:
      `http://localhost:3000/onboarding/payment/mock/mercadopago/pay?checkoutId=${checkoutId}`,

    sandbox_init_point:
      `http://localhost:3000/onboarding/payment/mock/mercadopago/pay?checkoutId=${checkoutId}`,

    body,
  });

}
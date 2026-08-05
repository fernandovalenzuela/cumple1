// app/onboarding/payment/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";

import { PaymentService } from "@/payment/PaymentService";
import { PaymentProviderType } from "@/lib/constants";

export async function POST(request: NextRequest) {

  try {

    const payload = await request.json();

    const paymentService = new PaymentService(
      PaymentProviderType.MercadoPagoAR
    );
console.log("### payload",payload);
    await paymentService.processWebhook(payload);

    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );

  }
  catch (error) {

    console.error(error);

    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );

  }

}
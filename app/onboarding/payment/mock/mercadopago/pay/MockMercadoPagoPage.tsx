"use client";

interface Props {
  checkoutId: string | null;
}

export default function MockMercadoPagoPage({
  checkoutId,
}: Props) {

  if (!checkoutId) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Checkout inexistente</h1>
      </main>
    );
  }

  async function pay(
    status: "approved" | "rejected" | "pending"
  ) {

    const response = await fetch(
      "/onboarding/payment/mock/mercadopago/api/pay",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutId,
          status,
        }),
      }
    );

    if (!response.ok) {
      alert("Error procesando el pago.");
      return;
    }

    const { redirectUrl } = await response.json();

    window.location.href = redirectUrl;

  }

  return (

    <main
      style={{
        maxWidth: 700,
        margin: "80px auto",
        padding: 32,
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >

      <h1 className="title-section ">Mercado Pago (Mock)</h1>

      <p>
        <h3 className="title2-section ">Checkout:</h3>
        {checkoutId}
      </p>

      <button
        type="button"
            className="admin-button flex-1 admin-button-medium"
        onClick={() => pay("approved")}
      >
        Aprobar pago
      </button>

      <button
        type="button"
            className="admin-button flex-1 admin-button-medium"
        onClick={() => pay("rejected")}
      >
        Rechazar pago
      </button>

      <button
       type="button"
            className="admin-button flex-1 admin-button-medium"
        onClick={() => pay("pending")}
      >
        Dejar pendiente
      </button>

    </main>

  );

}
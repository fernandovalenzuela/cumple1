import { resolveCommercialContext } from "@/lib/commercial/resolveCommercialContext";
import { getDefaultCountry } from "@/lib/countries";
import CustomerPage from "./customer/CustomerPage";

interface PageProps {
  searchParams: Promise<{
    code?: string;
  }>;
}

export default async function Page({
  searchParams,
}: PageProps) {
  const { code } = await searchParams;
  /*
   * Por ahora utilizamos el país por defecto.
   *
   * Más adelante será reemplazado por la
   * detección automática mediante middleware
   * o cabeceras HTTP.
   */
  const country = getDefaultCountry();
  const commercialResult =
    await resolveCommercialContext(
      country,
      code
    );
  if (!commercialResult.ok) {
    return (
      <main className="admin-container">
        <div className="admin-page">
          <section className="admin-card">
            <h1 className="admin-title">
              No es posible continuar
            </h1>
            <p className="admin-helper mt-6">
              {commercialResult.error}
            </p>
          </section>
        </div>
      </main>
    );
  }
  const {
    planId,
    accountId,
    country: pricingCountry,
    locale,
    currency,
    partner,
  } = commercialResult.context!;
console.log("## planId",planId);
  return (
    <CustomerPage
      commercialContext={{
        planId,
        accountId,
        country: pricingCountry,
        locale,
        currency,
        partner,
      }}
    />
  );
  
}
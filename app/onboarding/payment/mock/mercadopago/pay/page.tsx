import MockMercadoPagoPage from "./MockMercadoPagoPage";

interface PageProps {
  searchParams: Promise<{
    checkoutId?: string;
  }>;
}

export default async function Page({
  searchParams,
}: PageProps) {

  const { checkoutId } = await searchParams;

  return (
    <MockMercadoPagoPage
      checkoutId={checkoutId ?? null}
    />
  );

}
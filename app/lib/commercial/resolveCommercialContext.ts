import { PublicationMode, AccountType } from "@/lib/constants";
import { sql } from "@/lib/db";

export interface CommercialPartner {
  id: number;
  businessName: string | null;
  heroImage: string | null;
}

export interface CommercialContext {
  planId: number;
  accountId: number | null;
  country: string;
  locale: string;
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
  publicationMode: PublicationMode;
  autoPublishDelay: number;
  partner: CommercialPartner | null;
}

export interface CommercialContextResult {
  ok: boolean;
  context?: CommercialContext;
  error?: string;
}

interface CommercialRow {
  planId: number;
  country: string;
  locale: string;
  currency: string;
  price: string;
  discount: string;
  code: string | null;
  expiresAt: Date | null; // cuando vence este plan (birthdayPlans), no confundir con birthdayEvents.eventExpiresAt que indica hasta cuando puede estar publicado el evento
  maxUses: number;
  currentUses: number;
  publicationMode: number;
  autoPublishDelay: number;
  accountId: number | null;
  businessName: string | null;
  heroImage: string | null;
  accountType: number | null;
}

function resolveDiscount(
  row: CommercialRow
): number {
  const now = new Date();
  const configuredDiscount =
    Number(row.discount);
  if (configuredDiscount <= 0) {
    return 0;
  }
  if (row.currentUses >= row.maxUses) {
    return 0;
  }
  if (
    row.expiresAt !== null &&
    row.expiresAt <= now
  ) {
    return 0;
  }
  return configuredDiscount;
}

function calculateFinalPrice(
  price: number,
  discount: number
): number {
  return Number(
    (
      price -
      (price * discount) / 100
    ).toFixed(2)
  );
}

export async function resolveCommercialContext(
  country: string,
  code?: string | null
): Promise<CommercialContextResult> {
  
  const rows =
    await sql<CommercialRow[]>`
      select
        p.id                       as "planId",
        p.country,
        p.locale,
        p.currency,
        p.price,
        p.discount,
        p.code,
        p."expiresAt"              as "expiresAt",
        p."maxUses"                as "maxUses",
        p."currentUses"            as "currentUses",
        p."publicationMode"        as "publicationMode",
        p."autoPublishDelay"       as "autoPublishDelay",
        p."accountId"              as "accountId",
        a."businessName"           as "businessName",
        a."heroImage"              as "heroImage",
        a."accountType"            as "accountType"
      from
        "birthdayPlans" p
      left join
        "birthdayAccounts" a
      on
        a.id = p."accountId"
      where
        p.active = true
        and p.country = ${country}
      order by
        p.id desc
    `;
  if (rows.length === 0) {
    return {
      ok: false,
      error:
        "Actualmente el servicio no está disponible para tu país."
    };
  }
  let commercialRow: CommercialRow | undefined;
  if (
    code !== undefined &&
    code !== null &&
    code.trim() !== ""
  ) {
    commercialRow = rows.find(
      row => row.code?.trim().toUpperCase() === code.trim().toUpperCase()
    );
    if (!commercialRow) {
      return {
        ok: false,
        error:
          "El código promocional no es válido.\n\nVerificá que el enlace o el código recibido sean correctos.\n\nSi el problema continúa, comunicate con la persona o empresa que te proporcionó el código."
      };
    }
  }
  else {
    commercialRow = rows.find(
      row => row.code === null
    );
    if (!commercialRow) {
      return {
        ok: false,
        error:
          "Actualmente el servicio no está disponible para tu país."
      };
    }
  }
  const price =
    Number(commercialRow.price);
  const discount =
    resolveDiscount(commercialRow);
  const finalPrice =
    calculateFinalPrice(
      price,
      discount
    );
    let partner: CommercialPartner | null = null;
    if (commercialRow.accountId !== null) {
      if (commercialRow.accountType !== AccountType.Partner) {
        return {
          ok: false,
          error:
            "La configuración comercial es inválida. La cuenta asociada no corresponde a un Partner."
        };
      }
      partner = {
        id: commercialRow.accountId,
        businessName: commercialRow.businessName,
        heroImage: commercialRow.heroImage,
      };
    }
    return {
      ok: true,
      context: {
        planId: commercialRow.planId,
        accountId: commercialRow.accountId,
        country: commercialRow.country,
        locale: commercialRow.locale,
        currency: commercialRow.currency,
        price,
        discount,
        finalPrice,
        publicationMode:
          commercialRow.publicationMode as PublicationMode,
        autoPublishDelay:
          commercialRow.autoPublishDelay,
        partner,
      },
    };
}
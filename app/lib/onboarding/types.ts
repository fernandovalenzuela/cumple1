export interface CustomerFormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  locale: string;
  currency: string;
  waPhone: string;
  termsAccepted: boolean;
  captchaToken?: string;
  planId: number;
  occasionType:number;
}
export interface PartnerBranding {
  heroImage?: string;
  appName: string;
  appLogo: string;
}
export interface CustomerScreenProps {
  branding: PartnerBranding;
  defaultCountry: string;
  defaultLocale: string;
  defaultCurrency: string;
}
export interface CustomerPageProps {
  commercialContext: {
    planId: number;
    accountId: number | null;
    country: string;
    locale: string;
    currency: string;
    partner: {
      id: number;
      businessName: string | null;
      heroImage: string | null;
    } | null;
  };
}
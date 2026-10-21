"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingLayout from "@/components/onboarding/layout/OnboardingLayout";
import StepIndicator from "@/components/onboarding/layout/StepIndicator";
import Hero from "@/components/onboarding/hero/Hero";
import FormCard from "@/components/onboarding/form/FormCard";
import FooterActions from "@/components/onboarding/layout/FooterActions";
import { APP_CONFIG, State, OccasionType } from "@/lib/constants";
import { CustomerPageProps, CustomerFormData} from "@/lib/onboarding/types";
import CustomerForm from "./CustomerForm";
import { validateCustomerForm } from "@/lib/validation/customer";

import {
  createCustomer,
} from "./customer.actions";

export default function CustomerPage({
  commercialContext,
}: CustomerPageProps) {

  const router = useRouter();
  const [loading, setLoading] =
    useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] =
    useState<CustomerFormData>({
      fullName: "",
      email: "",
      password: "",
      waPhone: "",
      country:
        commercialContext.country,
      locale:
        commercialContext.locale,
      currency:
        commercialContext.currency,
      termsAccepted: false,
      captchaToken: "",
      planId: commercialContext.planId,
      occasionType:OccasionType.None,
    });

  //const [isValid,setIsValid]=useState(false); 
  const [submitted,setSubmitted]=useState(false); 

  function updateField<K extends keyof CustomerFormData>(
      field:K,
      value:CustomerFormData[K]
    ){
      setForm(current=>{
        const updated={...current,[field]:value,};
        const validation=validateCustomerForm(updated);
        setErrors(validation.errors);
        return updated;
      });
    }

  async function handleNext() {
    if (loading) {
      return;
    }
    setSubmitted(true);

    const validation =
      validateCustomerForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }
    try {
      setLoading(true);
//console.log("## 5");
      const result = await createCustomer(form);
      if (result.state === State.nok) {
        console.log("## 6 error ",result.message);
        setErrors({
          general: result.message,
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  //console.log("## 6");
    router.push("/onboarding/event");
  }

  return (
    <OnboardingLayout>
      <StepIndicator
        currentStep={1}
      />
      <Hero
        partnerHeroImage={
          commercialContext.partner?.heroImage ??
          undefined
        }
        appLogo="/images/logoapp.jpg"
        appName={APP_CONFIG.name}
        title="Organizá tu evento en pocos minutos."
        subtitle="Completá tus datos para comenzar."
      />

      <FormCard>
        <CustomerForm
          form={form}
          errors={errors}
          loading={loading}
          submitted={submitted}
          onChange={updateField}
        />

      </FormCard>

      <FooterActions
        nextLabel="Siguiente"
        loading={loading}
        loadingLabel="Creando cuenta..."
        disabled={loading}
        onNext={handleNext}
      />

    </OnboardingLayout>

  );

}
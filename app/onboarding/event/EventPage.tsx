"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/onboarding/hero/Hero";
import FormCard from "@/components/onboarding/form/FormCard";
import FooterActions from "@/components/onboarding/layout/FooterActions";
import OnboardingLayout from "@/components/onboarding/layout/OnboardingLayout";
import StepIndicator from "@/components/onboarding/layout/StepIndicator";
import { State } from "@/lib/constants";
import { UpdateEventData,updateEvent } from "./event.actions";
import { getCountries,getDefaultCountry } from "@/lib/countries";

type EventErrors={
  name?:string;
  eventBirthday?:string;
  locationName?:string;
  locationAddress?:string;
};

export default function EventPage(){

  const router=useRouter();

  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [generalError,setGeneralError]=useState("");

  const [street,setStreet]=useState("");
  const [extra,setExtra]=useState("");
  const [city,setCity]=useState("");
  const [state,setState]=useState("");
  const [country,setCountry]=useState(getDefaultCountry());
  const countries=getCountries();

  useEffect(()=>{

    async function loadCountry(){

        setCountry(getDefaultCountry());

    }

    loadCountry();

    },[]);

  const [form,setForm]=useState<UpdateEventData>({
    name:"",
    eventBirthday:"",
    locationName:"",
    locationAddress:"",
    celebratedAge:null,
    isMinorEvent:true,
    });

  const [errors,setErrors]=useState<EventErrors>({});

  function validate(data:UpdateEventData){

    const errors:EventErrors={};

    if(data.name.trim().length<2)
      errors.name="Ingresá el nombre del evento.";

    if(data.eventBirthday==="")
      errors.eventBirthday="Ingresá la fecha y hora del evento.";

    if(data.locationName.trim().length<2)
      errors.locationName="Ingresá el nombre del lugar.";

    if(street.trim().length<2 || city.trim().length<2 || state.trim().length<2)
        errors.locationAddress="Completá la dirección del evento.";

    return{
      valid:Object.keys(errors).length===0,
      errors,
    };

  }

  function updateField<K extends keyof UpdateEventData>(field:K,value:UpdateEventData[K]){

    const updated={
      ...form,
      [field]:value,
    };

    setForm(updated);

    if(!submitted)
      return;

    setErrors(validate(updated).errors);

  }

  async function handleNext(){

    if(loading)
      return;

    setSubmitted(true);

    const validation=validate(form);

    setErrors(validation.errors);

    if(!validation.valid)
      return;

    setLoading(true);
    setGeneralError("");

    try{
      form.locationAddress=[
        street.trim(),
        extra.trim(),
        city.trim(),
        state.trim(),
        country.trim(),
      ].join(",");

      const result=await updateEvent(form);

      if(result.state===State.nok){
        setGeneralError(result.message);
        return;
      }

      /*
       * Continuará en la pantalla que
       * envuelve EventPageView.
       */
      router.push("/onboarding/editor");

    }
    finally{

      setLoading(false);

    }

  }

    return(
    <OnboardingLayout>
      <StepIndicator currentStep={2}/>
   
      <div className="admin-form-gap"/>
      <FormCard>

        <div className="admin-field">
          <label className="admin-label">Nombre del evento</label>
          <input
            className="admin-input"
            type="text"
            autoComplete="off"
            maxLength={120}
            value={form.name}
            disabled={loading}
            onChange={e=>updateField("name",e.target.value)}
          />
          <p className="admin-helper">
            Ejemplos: "Cumple Juan Pérez", "50° Aniversario", "Club Atlético San Martín", "25 años de la empresa".
          </p>
          {submitted && errors.name && <p className="admin-error">{errors.name}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-label">Fecha y hora del evento</label>
          <input
            className="admin-input"
            type="datetime-local"
            value={form.eventBirthday}
            disabled={loading}
            onChange={e=>updateField("eventBirthday",e.target.value)}
          />
          {submitted && errors.eventBirthday && <p className="admin-error">{errors.eventBirthday}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-label">Nombre del lugar</label>
          <input
            className="admin-input"
            type="text"
            autoComplete="organization"
            maxLength={120}
            value={form.locationName}
            disabled={loading}
            onChange={e=>updateField("locationName",e.target.value)}
          />
          {submitted && errors.locationName && <p className="admin-error">{errors.locationName}</p>}
        </div>

        <div className="admin-field">
            <label className="admin-label">Dirección del evento</label>

            <input
                className="admin-input"
                placeholder="Calle y número"
                value={street}
                disabled={loading}
                onChange={e=>setStreet(e.target.value)}
            />

            <div style={{height:12}}/>

            <input
                className="admin-input"
                placeholder="Piso, departamento (opcional)"
                value={extra}
                disabled={loading}
                onChange={e=>setExtra(e.target.value)}
            />

            <div style={{height:12}}/>

            <input
                className="admin-input"
                placeholder="Ciudad"
                value={city}
                disabled={loading}
                onChange={e=>setCity(e.target.value)}
            />

            <div style={{height:12}}/>

            <input
                className="admin-input"
                placeholder="Provincia / Estado"
                value={state}
                disabled={loading}
                onChange={e=>setState(e.target.value)}
            />

            <div style={{height:12}}/>

            <select
                className="admin-select"
                value={country}
                disabled={loading}
                onChange={e=>setCountry(e.target.value)}
                >
                {countries.map(country=>(
                    <option
                    key={country.code}
                    value={country.code}
                    >
                    {country.name}
                    </option>
                ))}
                </select>

            {submitted && errors.locationAddress && <p className="admin-error">{errors.locationAddress}</p>}
            </div>

        <div className="admin-field">
          <label className="admin-label">Años a celebrar (opcional)</label>
          <input
            className="admin-input"
            type="number"
            min={1}
            max={999}
            value={form.celebratedAge ?? ""}
            disabled={loading}
            onChange={e=>updateField("celebratedAge",e.target.value==="" ? null : Number(e.target.value))}
          />
          <p className="admin-helper">
            Si corresponde, indicá la cantidad de años que se celebran.
          </p>
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.isMinorEvent}
            disabled={loading}
            onChange={e=>updateField("isMinorEvent",e.target.checked)}
          />
          <span>Es un evento referente a un menor de edad.</span>
        </label>

        {generalError!=="" && <p className="admin-error">{generalError}</p>}

      </FormCard>
      <div className="admin-section-gap"/>
      <FooterActions
        loading={loading}
        loadingLabel="Guardando datos del evento..."
        nextLabel="Siguiente"
        disabled={loading}
        onNext={handleNext}
      />

    </OnboardingLayout>
  );

}
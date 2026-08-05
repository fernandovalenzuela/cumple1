export type PaymentSummaryEvent={
    id:number;
    name:string;
    eventBirthday:Date|null;
    planId:number;
    planName:string;
    description:string;
    price:number;
    discount:number;
    currency:string;
    locale:string;
    paymentProvider:number;
    status:number;
    contactEmail:string;
  };
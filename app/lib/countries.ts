import { DEFAULTS } from "@/lib/constants";

export interface Country{
  code:string;
  name:string;
  phonePrefix:string;
  locale:string;
  currency:string;
}

export function getDefaultCountry():string{
  return DEFAULTS.country;
}

export interface Coordinates{
  latitude:number|null;
  longitude:number|null;
}

export async function getCoordinates(address:string):Promise<Coordinates>{

  const [street,,city,state,country]=address.split(",");

  const query=[
    street?.trim(),
    city?.trim(),
    state?.trim(),
    country?.trim(),
  ].filter(Boolean).join(", ");

  if(query==="")
    return{
      latitude:null,
      longitude:null,
    };

  try{

    const response=await fetch(
      "https://nominatim.openstreetmap.org/search?format=jsonv2&q="+encodeURIComponent(query),
      {
        headers:{
          "User-Agent":"BirthApp/1.0",
        },
        cache:"no-store",
      }
    );

    if(!response.ok)
      return{
        latitude:null,
        longitude:null,
      };

    const data=await response.json();

    if(!Array.isArray(data) || data.length===0)
      return{
        latitude:null,
        longitude:null,
      };

    return{
      latitude:Number(data[0].lat),
      longitude:Number(data[0].lon),
    };

  }
  catch{

    return{
      latitude:null,
      longitude:null,
    };

  }

}

export function getCountries():Country[]{

  return[
    {code:"AR",name:"Argentina",phonePrefix:"+54",locale:"es-AR",currency:"ARS"},
    {code:"BO",name:"Bolivia",phonePrefix:"+591",locale:"es-BO",currency:"BOB"},
    {code:"BR",name:"Brasil",phonePrefix:"+55",locale:"pt-BR",currency:"BRL"},
    {code:"CA",name:"Canadá",phonePrefix:"+1",locale:"en-CA",currency:"CAD"},
    {code:"CL",name:"Chile",phonePrefix:"+56",locale:"es-CL",currency:"CLP"},
    {code:"CO",name:"Colombia",phonePrefix:"+57",locale:"es-CO",currency:"COP"},
    {code:"CR",name:"Costa Rica",phonePrefix:"+506",locale:"es-CR",currency:"CRC"},
    {code:"DO",name:"República Dominicana",phonePrefix:"+1",locale:"es-DO",currency:"DOP"},
    {code:"EC",name:"Ecuador",phonePrefix:"+593",locale:"es-EC",currency:"USD"},
    {code:"SV",name:"El Salvador",phonePrefix:"+503",locale:"es-SV",currency:"USD"},
    {code:"ES",name:"España",phonePrefix:"+34",locale:"es-ES",currency:"EUR"},
    {code:"US",name:"Estados Unidos",phonePrefix:"+1",locale:"en-US",currency:"USD"},
    {code:"GT",name:"Guatemala",phonePrefix:"+502",locale:"es-GT",currency:"GTQ"},
    {code:"HN",name:"Honduras",phonePrefix:"+504",locale:"es-HN",currency:"HNL"},
    {code:"MX",name:"México",phonePrefix:"+52",locale:"es-MX",currency:"MXN"},
    {code:"NI",name:"Nicaragua",phonePrefix:"+505",locale:"es-NI",currency:"NIO"},
    {code:"PA",name:"Panamá",phonePrefix:"+507",locale:"es-PA",currency:"PAB"},
    {code:"PY",name:"Paraguay",phonePrefix:"+595",locale:"es-PY",currency:"PYG"},
    {code:"PE",name:"Perú",phonePrefix:"+51",locale:"es-PE",currency:"PEN"},
    {code:"PT",name:"Portugal",phonePrefix:"+351",locale:"pt-PT",currency:"EUR"},
    {code:"UY",name:"Uruguay",phonePrefix:"+598",locale:"es-UY",currency:"UYU"},
    {code:"VE",name:"Venezuela",phonePrefix:"+58",locale:"es-VE",currency:"VES"},
  ];

}
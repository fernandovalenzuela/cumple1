import { Countdown } from "./components/Countdown"
import { RSVP } from "./components/RSVP"
import { Messages } from "./components/Messages"
import { formatDate } from "./utils"
import { inter, roboto } from '@/app/fonts';
import Image from 'next/image'

export default function EventPage() {
  const event = {
	name: "Mica",
    title: "Mis divinos 15 ✨",
    date: "2026-06-12",
	time: "21:00",
    location: "Salón La Fiesta",
	address: "Jorges Luis Borges 2071, Buenos Aires",
    description: "Vení a mi cumple ❤️",
    image: "/person.jpg",
	wherepic:"/salon.jpg",
  }

  return (
    <main className="bg-white text-gray-800">


      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-pink-100 to-white"
	  >
		{/* Imagen fondo completa */}
	  <div
		className="absolute inset-0 bg-cover bg-center opacity-10"
		style={{
		  backgroundImage: "url('/hearts.jpg')",
		  backgroundSize: "120%",
		}}
	  />
	  
		 {/* overlay corazones */}
			 { /*<div className="absolute inset-0 bg-hearts opacity-50 pointer-events-none" />*/ }

		<div className="text-4xl font-bold tracking-tight py-8">
          {event.name}
        </div>
	  
        <img
          src={event.image}
          className="w-70 h-70 object-cover rounded-full shadow-lg mb-6 border-4 border-white"
        />



        <div className="text-4xl font-bold tracking-tight  pt-8">
          {event.title}
        </div>

        <p className="mt-2 text-2xl text-gray-600 max-w-md pb-18">
          {event.description}
        </p>
		
		{/* COUNTDOWN */}
			{ /*<section className="py-0 text-center"> */}
        <Countdown targetDate={event.date} />
			{ /*</section> */}
		
      </section>

      

		{/* INFO */}
		<section className="py-16 bg-gray-50 text-center px-6 bg-pink-50">

		  <div className="space-y-12">

			{/* CUANDO */}
			<div>
			  <h2 className="text-3xl font-bold mb-4">
				¿Cuándo?
			  </h2>

			  <p className="text-lg">
				📅 {formatDate(event.date)}
			  </p>

			  <p className="text-base text-gray-600">
				🕒 {event.time} hs
			  </p>
			</div>

			{/* DONDE */}
			<div>
			  <h2 className="text-3xl font-bold mb-4">
				¿Dónde?
			  </h2>

			  <p className="text-lg">
				📍 {event.location}
			  </p>
			  <p className="text-lg pb-4">
				{event.address}
			  </p>
			  
			  <div className="border-15 border-white inline-block">
			  <Image
			  src={event.wherepic}
			  width={500}
			  height={500}
			  alt="Salon "
			/>
			</div>
			
			{/* MAPA */}
			  <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg pt-4">
				<iframe
				  src="https://www.google.com/maps?q=Jorge+Luis+Borges+2071+Buenos+Aires&output=embed"
				  className="w-full h-[300px] border-0"
				  loading="lazy"
				/>
			  </div>

			  {/* BOTÓN */}
			  <a
				href="https://www.google.com/maps?q=Jorge+Luis+Borges+2071+Buenos+Aires"
				target="_blank"
				className="inline-block mt-6 bg-white text-grey px-6 py-3 rounded-lg shadow transition"
			  >
				Cómo llegar
			  </a>
			  
			</div>

		  </div>

		</section>

      

      {/* RSVP */}
      <section className="py-16 bg-gray-50 text-center px-6">
        <h2 className="text-2xl font-semibold mb-4">
          Confirmar asistencia
        </h2>
        <RSVP />
      </section>

      {/* MENSAJES */}
      <section className="py-16 text-center px-6">
        <h2 className="text-2xl font-semibold mb-4">
          Dejá tu mensaje 💬
        </h2>
        <Messages />
      </section>

     
	  
	  {/* GALERIA */}
      <section className="py-16 px-4 bg-pink-50">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Momentos
        </h2>

        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <img src="/momento1.jpg" className="rounded-lg shadow" />
          <img src="/momento2.jpg" className="rounded-lg shadow" />
        </div>
      </section>
	  
	   {/* CIERRE */}
      <section className="py-20 bg-pink-500 text-white text-center">
        <h2 className="text-xl font-semibold">
          Te espero para celebrar juntos 🎉
        </h2>
      </section>

    </main>
  )
}
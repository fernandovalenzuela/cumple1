import Image from "next/image";

interface HeroProps {
  partnerHeroImage?: string;
  appLogo: string;
  appName: string;
  title: string;
  subtitle: string;
}

export default function Hero({
  partnerHeroImage,
  appLogo,
  appName,
  title,
  subtitle,
}: HeroProps) {

  const isPartner = !!partnerHeroImage;

  return (
    <section className="text-center mb-10">
      { /* isPartner ? (
        <>
          <Image
            src={partnerHeroImage}
            alt="Partner"
            width={700}
            height={250}
            className="rounded-3xl w-full object-cover shadow-sm"
            priority
          />
          <p className="admin-helper mt-4">
            Powered by {appName}
          </p>
        </>
      ) : (

        <>
          <Image
            src={appLogo}
            alt={appName}
            width={120}
            height={120}
            className="mx-auto"
            priority
          />
        </>

      ) */}

      { (title !=="" && title !== undefined) &&
        (<h1 className="admin-title mt-8"> {title} </h1>)
      }

      { (subtitle !=="" && subtitle !== undefined) &&
        (<p>{subtitle}</p>)
      }

    </section>
  );
}
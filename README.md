
Ejecucion:

pnpm dev

pnpm build


TUNEL

cloudflared tunnel --url http://localhost:3000 --protocol http2


url: buscar "Your quick Tunnel has been created! Visit it at (it may take some time to be reachable)"

url/onboarding




------------------






This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


----------------------------------------------------
Ejecucion debug, acceso local celular:

Powershell 1:
-------------
c:\fuentes\nextjs\cumple1\cumple1\
pnpm dev


Powershell 2:
------------
cloudflared tunnel --url http://localhost:3000 --protocol http2

Se debe buscar la url dentro de la salida en el terminal. Aparece aqui:

+--------------------------------------------------------------------------------------------+
2026-08-18T15:09:56Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2026-08-18T15:09:56Z INF |  https://xxxxxxxxx.com                                 |
2026-08-18T15:09:56Z INF +--------------------------------------------------------------------------------------------+


Poner en el celular:
https://xxxxxxxxx.com/onboarding/editor



---------------------------------------------------

OLD
pnpm dev --hostname 0.0.0.0


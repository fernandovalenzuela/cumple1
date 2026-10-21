import { headers } from 'next/headers';

export async function isMobileDevice(): Promise<boolean> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  // Expresión regular estándar para detectar navegadores móviles
  return /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}
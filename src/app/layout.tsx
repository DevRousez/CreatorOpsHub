import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CreatorOps Hub - Panel de Control Multicuenta (YouTube & TikTok)',
  description: 'Monitorea las estadísticas en tiempo real de tus canales de YouTube y cuentas de TikTok en un solo lugar.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  other: {
    'tiktok-developers-site-verification': '2jXIzLAfnZVfNWNAEu2y39CN84IDj9F3',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

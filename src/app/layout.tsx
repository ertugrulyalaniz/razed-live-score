import type { Metadata } from 'next';
import { Barlow } from 'next/font/google';
import { Providers } from './providers';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Live Score',
  description: 'Real-time sports match scores',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={barlow.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

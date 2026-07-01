import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wetgeving naar Dienstverlening',
  description: 'Prototype voor waarde-gevoelige vertaling van regelgeving naar diensten',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}

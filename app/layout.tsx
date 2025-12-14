import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Virtual Try-On Studio',
  description: 'Create stunning virtual try-on previews with AI-powered image generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-black text-white`}
        style={{ display: 'block' }}
      >
        <ToastProvider>
          <div className="min-h-screen">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/app/components/Navbar';

export const metadata: Metadata = {
  title: 'LearnSpace | Course Portal',
  description: 'A simple online course management portal.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-shell">{children}</main>
        <footer className="footer">LearnSpace · Online Course Management System</footer>
      </body>
    </html>
  );
}

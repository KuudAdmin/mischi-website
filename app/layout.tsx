import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cookie } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const cookie = Cookie({
  variable: '--font-cookie',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mischi — Your Mac Companion',
  description: 'Run animated desktop pets on macOS. Interactive, offline-first, no cloud required.',
  openGraph: {
    title: 'Mischi — Your Mac Companion',
    description: 'Run animated desktop pets on macOS. Interactive, offline-first, no cloud required.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cookie.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

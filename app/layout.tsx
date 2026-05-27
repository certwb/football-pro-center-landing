import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Football Pro Center | Ақтаудағы кәсіби футбол орталығы',
  description: 'Ақтаудағы алғашқы кешенді кәсіби футбол орталығы. Кәсіби талдау, жаттығу, спорт тауарлары және мини-стадион бір жерде.',
  keywords: ['футбол', 'Ақтау', 'мини-стадион', 'жаттығу', 'спорт', 'Football Pro Center'],
  authors: [{ name: 'Football Pro Center' }],
  openGraph: {
    title: 'Football Pro Center | Ақтаудағы кәсіби футбол орталығы',
    description: 'Ақтаудағы алғашқы кешенді кәсіби футбол орталығы',
    type: 'website',
    locale: 'kk_KZ',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kk" className="dark bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

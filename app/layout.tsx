import type { Metadata } from 'next'
import './globals.css'
import '@/lib/chartjs'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'FinBoard - Finance Dashboard',
  description: 'Customizable Finance Dashboard with real-time data visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


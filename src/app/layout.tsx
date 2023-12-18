import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { MovieProvider } from '@/contexts/movieContext'


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <MovieProvider>
          <body>
            <Navbar />
            {children}
          </body>
        </MovieProvider>
      </UserProvider>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { MovieProvider } from '@/contexts/movieContext'
import { Oswald } from 'next/font/google'
import { UserContextProvider } from '@/contexts/userContext'

const oswald = Oswald({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-oswald' 
})

export const metadata: Metadata = {
  title: 'CineMate',
  description: 'Your moviehub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"
    className={`${oswald.variable}`}
    >
      <UserProvider>
        <UserContextProvider>
          <MovieProvider>
            <body>
              <Navbar />
              {children}
            </body>
          </MovieProvider>
        </UserContextProvider>
      </UserProvider>
    </html>
  )
}

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Activity, Beaker, FileBox, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "OncoMouth | Early Oral Cancer Detection",
  description: "Domain-Aware Deep Learning for Early Oral Cancer Detection.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-primary-light selection:text-primary">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group transition-all">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold tracking-tight text-lg">OncoMouth</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/predict" className="hover:text-primary transition-colors flex items-center gap-2">
                <Beaker className="w-4 h-4" />
                Workspace
              </Link>
              <Link href="/research" className="hover:text-primary transition-colors flex items-center gap-2">
                <FileBox className="w-4 h-4" />
                Research
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="https://github.com" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                  <Code className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  )
}


import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Ethiopian Navigator - Government Services Portal",
  description:
    "Multilingual government service portal for Ethiopian citizens with AI-powered support in Amharic, Oromo, and English.",
  keywords: ["Ethiopia", "government services", "e-government", "citizen portal", "Amharic", "Oromo"],
  authors: [{ name: "Ethiopian Navigator Team" }],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import resulticon from "@/public/result.jpg"
import Image from "next/image"
import  Analysis from "@/public/analysis.webp"
import history from "@/public/history-svgrepo-com.svg"
export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data.session)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">SceneBreak</h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button onClick={() => router.push("/protected/breakdown")}>Go to App</Button>
                <Button variant="ghost" onClick={() => router.push("/protected/history")}>
                  History
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-balance">AI-Powered Scene Breakdown</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Instantly analyze film and theater scenes with artificial intelligence. Extract characters, themes,
              locations, and deeper insights in seconds.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => router.push("/protected/breakdown")}>
                Start Breaking Down
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Get Started Free</Link>
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 pt-8">
            <div className="space-y-4">
              <div className="text-4xl bg-white rounded-full p-2 w-fit mx-auto">
                <Image src={Analysis} alt="Analysis Icon" width={80} height={80} />
              </div>
              <h3 className="font-semibold text-lg">Intelligent Analysis</h3>
              <p className="text-sm text-muted-foreground">Powered by  Groq for comprehensive scene understanding</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl bg-white rounded-full p-2 w-fit mx-auto">
              <Image src={resulticon} alt="Results Icon" width={80} height={80} />
              </div>
              <h3 className="font-semibold text-lg">Instant Results</h3>
              <p className="text-sm text-muted-foreground">Get detailed breakdowns in seconds, not hours</p>
            </div>
            <div className="space-y-4 justify-center">
              <div className="text-4xl bg-white rounded-full p-2 w-fit mx-auto">
                <Image src={history} alt="History Icon" width={80} height={80} />
              </div>
              <h3 className="font-semibold text-lg">Full History</h3>
              <p className="text-sm text-muted-foreground">Save and access all your previous breakdowns</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
 
"use client"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Scene {
  id: string
  title: string
  description: string
  created_at: string
  breakdowns: Array<{
    id: string
    characters: string[]
    themes: string[]
  }>
}

export default function HistoryPage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchScenes = async () => {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push("/auth/login")
        return
      }

      setUser(userData.user)

      const { data, error } = await supabase
        .from("scenes")
        .select(`
          id,
          title,
          description,
          created_at,
          breakdowns (
            id,
            characters,
            themes
          )
        `)
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setScenes(data as Scene[])
      }

      setIsLoading(false)
    }

    fetchScenes()
  }, [router])

  const handleDelete = async (sceneId: string) => {
    if (!window.confirm("Are you sure you want to delete this scene?")) return

    const supabase = createClient()
    const { error } = await supabase.from("scenes").delete().eq("id", sceneId)

    if (!error) {
      setScenes(scenes.filter((s) => s.id !== sceneId))
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary hover:opacity-80 transition">SceneBreak AI</h1>
          </Link>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/protected/breakdown">Analyze Scene</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                router.push("/")
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Breakdown History</h2>
          <p className="text-muted-foreground">Your saved scene analyses and breakdowns</p>
        </div>

        {scenes.length === 0 ? (
          <Card className="border border-border/50">
            <CardContent className="py-16 text-center">
              <div className="text-muted-foreground space-y-4">
                <div className="text-6xl">📚</div>
                <p className="text-lg">No scenes yet</p>
                <p className="text-sm">Start by analyzing a scene to build your library</p>
                <Button asChild className="mt-4">
                  <Link href="/protected/breakdown">Analyze Your First Scene</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {scenes.map((scene) => (
              <Card key={scene.id} className="border border-border/50 hover:border-border/80 transition">
                <CardHeader>
                  <CardTitle>{scene.title}</CardTitle>
                  {scene.description && <p className="text-sm text-muted-foreground mt-1">{scene.description}</p>}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs text-muted-foreground">{new Date(scene.created_at).toLocaleDateString()}</div>

                  {scene.breakdowns.length > 0 && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Characters</p>
                        <div className="flex flex-wrap gap-1">
                          {scene.breakdowns[0].characters.slice(0, 3).map((char, i) => (
                            <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Themes</p>
                        <div className="flex flex-wrap gap-1">
                          {scene.breakdowns[0].themes.slice(0, 3).map((theme, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-secondary/30 text-secondary-foreground text-xs rounded"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => router.push("/protected/breakdown")}>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(scene.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

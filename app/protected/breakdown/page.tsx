"use client"

import type React from "react"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface BreakdownResult {
  characters: string[]
  locations: string[]
  themes: string[]
  tone: string
  structure: string
  technicalNotes: string
  visualElements: string
  emotionalArc: string
}

export default function BreakdownPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sceneText, setSceneText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [breakdown, setBreakdown] = useState<BreakdownResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login")
      } else {
        setUser(data.user)
      }
    }

    checkAuth()
  }, [router])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setBreakdown(null)

    try {
      const response = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneText }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze scene")
      }

      const data = await response.json()
      setBreakdown(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!breakdown || !user) return

    setIsSaving(true)
    const supabase = createClient()

    try {
      // Insert scene
      const { data: sceneData, error: sceneError } = await supabase
        .from("scenes")
        .insert({
          user_id: user.id,
          title: title || "Untitled Scene",
          description,
          scene_text: sceneText,
        })
        .select()
        .single()

      if (sceneError) throw sceneError

      // Insert breakdown
      const { error: breakdownError } = await supabase.from("breakdowns").insert({
        scene_id: sceneData.id,
        user_id: user.id,
        characters: breakdown.characters,
        locations: breakdown.locations,
        themes: breakdown.themes,
        tone: breakdown.tone,
        structure: breakdown.structure,
        technical_notes: breakdown.technicalNotes,
        visual_elements: breakdown.visualElements,
        emotional_arc: breakdown.emotionalArc,
      })

      if (breakdownError) throw breakdownError

      router.push("/protected/history")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save breakdown")
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
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
            <Button variant="ghost" asChild>
              <Link href="/protected/history">History</Link>
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Analyze a Scene</h2>
              <p className="text-muted-foreground">Paste your scene text and get instant AI-powered analysis</p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Scene Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Coffee Shop Confrontation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="e.g., Act 2, Scene 3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scene">Scene Text *</Label>
                <Textarea
                  id="scene"
                  placeholder="Paste your scene script or description here..."
                  value={sceneText}
                  onChange={(e) => setSceneText(e.target.value)}
                  className="min-h-96 font-mono text-sm"
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading || !sceneText} className="flex-1">
                  {isLoading ? "Analyzing..." : "Break Down Scene”"}
                </Button>
                {breakdown && (
                  <Button type="button" onClick={handleSave} disabled={isSaving} variant="secondary">
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {breakdown ? (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Analysis Results</h2>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.characters.map((char, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {char}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.locations.map((loc, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-secondary/30 text-secondary-foreground text-sm rounded-full"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {breakdown.themes.map((theme, i) => (
                        <span key={i} className="px-3 py-1 bg-accent/20 text-accent-foreground text-sm rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Tone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{breakdown.tone}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{breakdown.structure}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{breakdown.technicalNotes}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Visual Elements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{breakdown.visualElements}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Emotional Arc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{breakdown.emotionalArc}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4 text-muted-foreground">
                  <div className="text-6xl">📝</div>
                  <p>Paste a scene script to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

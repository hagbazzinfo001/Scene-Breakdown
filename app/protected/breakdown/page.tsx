

"use client"

import type React from "react"

 import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
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
  const [isLoadingScene, setIsLoadingScene] = useState(false)
  const [editSceneId, setEditSceneId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sceneId = searchParams.get("sceneId")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/auth/login")
      } else {
        setUser(data.user)

        if (sceneId) {
          await loadScene(sceneId)
        }
      }
    }

    checkAuth()
  }, [router, sceneId])

  const loadScene = async (id: string) => {
    setIsLoadingScene(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("scenes")
        .select(
          `
          id,
          title,
          description,
          scene_text,
          breakdowns (
            characters,
            locations,
            themes,
            tone,
            structure,
            technical_notes,
            visual_elements,
            emotional_arc
          )
        `,
        )
        .eq("id", id)
        .single()

      if (error) throw error

      if (data) {
        setTitle(data.title)
        setDescription(data.description)
        setSceneText(data.scene_text)
        setEditSceneId(data.id)

        if (data.breakdowns && data.breakdowns.length > 0) {
          const bd = data.breakdowns[0]
          setBreakdown({
            characters: bd.characters || [],
            locations: bd.locations || [],
            themes: bd.themes || [],
            tone: bd.tone || "",
            structure: bd.structure || "",
            technicalNotes: bd.technical_notes || "",
            visualElements: bd.visual_elements || "",
            emotionalArc: bd.emotional_arc || "",
          })
        }
      }
    } catch (err) {
      console.error("[v0] Error loading scene:", err)
      setError("Failed to load scene")
    } finally {
      setIsLoadingScene(false)
    }
  }

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
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Server error: ${response.status}`
        console.error("[v0] API error:", errorData)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setBreakdown(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      console.error("[v0] Analysis error:", message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!breakdown || !user) return

    setIsSaving(true)
    const supabase = createClient()

    try {
      console.log("[v0] Starting save with user_id:", user.id)

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

      if (sceneError) {
        console.error("[v0] Scene insert error:", sceneError)
        throw sceneError
      }

      console.log("[v0] Scene created with ID:", sceneData?.id)

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

      if (breakdownError) {
        console.error("[v0] Breakdown insert error:", breakdownError)
        throw breakdownError
      }

      console.log("[v0] Breakdown saved successfully")
      router.push("/protected/history")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save breakdown"
      console.error("[v0] Save error details:", err)
      setError(errorMessage)
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
            <h1 className="text-2xl font-bold text-primary hover:opacity-80 transition">SceneBreak</h1>
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
              <h2 className="text-3xl font-bold mb-2">{editSceneId ? "View Scene" : "Analyze a Scene"}</h2>
              <p className="text-muted-foreground">
                {editSceneId
                  ? "Viewing your previously analyzed scene"
                  : "Paste your scene text and get instant AI-powered analysis"}
              </p>
            </div>

            {isLoadingScene ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading scene...</p>
              </div>
            ) : (
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Scene Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Coffee Shop Confrontation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={editSceneId ? true : false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Act 2, Scene 3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={editSceneId ? true : false}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scene">Scene Text *</Label>
                  <Textarea
                    id="scene"
                    placeholder="Paste your scene script or description here..."
                    value={sceneText}
                    onChange={(e) => setSceneText(e.target.value)}
                    className="min-h-60 font-mono text-sm"
                    required
                    disabled={editSceneId ? true : false}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-2 pt-4">
                  {!editSceneId && (
                    <Button type="submit" disabled={isLoading || !sceneText} className="flex-1">
                      {isLoading ? "Analyzing..." : "Break Down Scene"}
                    </Button>
                  )}
                  {breakdown && !editSceneId && (
                    <Button type="button" onClick={handleSave} disabled={isSaving} variant="secondary">
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  )}
                  {editSceneId && (
                    <Button
                      type="button"
                      onClick={() => {
                        router.push("/protected/history")
                      }}
                      variant="secondary"
                      className="flex-1"
                    >
                      Back to History
                    </Button>
                  )}
                </div>
              </form>
            )}
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
                  <p>{isLoadingScene ? "Loading scene..." : "Paste a scene script to get started"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

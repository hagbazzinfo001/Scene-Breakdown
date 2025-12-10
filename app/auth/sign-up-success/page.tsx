import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-secondary">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">We've sent you a confirmation link to verify your account</p>
        </div>
        <div className="pt-4">
          <Button asChild>
            <Link href="/">Return to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

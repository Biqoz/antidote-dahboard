"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirection vers le dashboard sans validation
    router.push("/dashboard")
  }

  const handleGoogleLogin = () => {
    // Redirection vers le dashboard sans validation
    router.push("/dashboard")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Connexion à votre compte</CardTitle>
          <CardDescription>
            Entrez vos informations ci-dessous (ou laissez vide et cliquez sur Login)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input id="password" type="password" />
              </Field>
              <Field>
                <Button type="submit" className="w-full">Se connecter</Button>
                <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
                  Se connecter avec Google
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Pas de compte ? <a href="#" className="underline underline-offset-4 hover:text-primary">S&apos;inscrire</a>
                </p>
              </Field>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

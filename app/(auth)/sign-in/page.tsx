import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/lib/auth";
import { env } from "@/lib/env";

export default function SignInPage() {
  const isGoogleEnabled = Boolean(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md border-white/60 bg-white/90">
        <CardHeader>
          <CardDescription>Auth.js + Google</CardDescription>
          <CardTitle>Accede al panel de la agencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button className="w-full" disabled={!isGoogleEnabled}>
              Entrar con Google
            </Button>
          </form>
          {!isGoogleEnabled ? (
            <p className="mt-3 text-sm text-slate-500">
              Configura `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET` para habilitar el login.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, FolderTree, LineChart, SearchCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FolderTree,
    title: "Arquitectura SEO jerárquica",
    description: "Modela departamentos, categorías, subcategorías y URLs dentro de un árbol consistente por proyecto."
  },
  {
    icon: SearchCheck,
    title: "Tracking keyword + URL",
    description: "Asigna keywords principales y secundarias a cada URL y cruza GSC con posiciones reales en Google."
  },
  {
    icon: LineChart,
    title: "Histórico diario y competidores",
    description: "Guarda snapshots diarios con métricas y detecta los dominios que te superan en SERP."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-xl shadow-amber-100/40 backdrop-blur md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">SEO SaaS for agencies</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Controla clientes, arquitectura SEO y ranking real desde un solo panel.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Base lista con Next.js, Prisma, Auth.js, PostgreSQL, Inngest, Google Search Console y Serper para construir un SEO operating system multi-cliente.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Ir al dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-in">Configurar acceso</Link>
              </Button>
            </div>
          </div>

          <Card className="border-none bg-slate-950 text-white">
            <CardHeader>
              <CardDescription className="text-slate-400">Pipeline diario</CardDescription>
              <CardTitle className="text-white">Search Console + SERP live</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                1. Inngest dispara sincronizaciones diarias por proyecto.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                2. GSC devuelve clics, impresiones, CTR y posición media por query + URL.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                3. Serper detecta la posición real actual y qué competidores te superan.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-white/60 bg-white/80">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>
    </main>
  );
}

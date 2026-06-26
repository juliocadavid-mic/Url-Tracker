import { BarChart3, DatabaseZap, Workflow } from "lucide-react";

import { ProjectCard } from "@/components/dashboard/project-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const agencies = await getDashboardData();
  const projectCount = agencies.flatMap((agency) => agency.clients.flatMap((client) => client.projects)).length;
  const keywordCount = agencies
    .flatMap((agency) => agency.clients.flatMap((client) => client.projects))
    .reduce((sum, project) => sum + project.trackedKeywords, 0);

  return (
    <main className="min-h-screen xl:flex">
      <Sidebar />

      <div className="flex-1 px-6 py-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Agency dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Multi-client SEO operations</h1>
          <p className="max-w-3xl text-slate-600">
            Vista inicial para controlar clientes, proyectos, keywords, snapshots diarios y dominios competidores detectados en SERP.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/60 bg-white/85">
            <CardHeader>
              <CardDescription>Clientes y proyectos</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Workflow className="h-7 w-7" />
                {formatNumber(projectCount)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-white/60 bg-white/85">
            <CardHeader>
              <CardDescription>Keywords trackeadas</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <BarChart3 className="h-7 w-7" />
                {formatNumber(keywordCount)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-white/60 bg-white/85">
            <CardHeader>
              <CardDescription>Stack operativo</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <DatabaseZap className="h-7 w-7" />
                Prisma + Inngest
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="mt-8 space-y-8">
          {agencies.length > 0 ? (
            agencies.map((agency) => (
              <div key={agency.id}>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-slate-950">{agency.name}</h2>
                  <p className="text-sm text-slate-500">Clientes activos: {agency.clients.length}</p>
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                  {agency.clients.flatMap((client) =>
                    client.projects.map((project) => <ProjectCard key={project.id} clientName={client.name} project={project} />)
                  )}
                </div>
              </div>
            ))
          ) : (
            <Card className="border-dashed border-slate-300 bg-white/75">
              <CardHeader>
                <CardTitle>No hay datos cargados</CardTitle>
                <CardDescription>
                  Ejecuta la semilla inicial o crea agencias, clientes y proyectos para empezar a sincronizar Search Console y SERPs.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                El modelo ya soporta múltiples agencias, múltiples clientes por agencia, árbol SEO por proyecto y snapshots diarios.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

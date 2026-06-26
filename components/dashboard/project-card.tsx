import { ArrowUpRight, Globe2, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

type ProjectCardProps = {
  clientName: string;
  project: {
    id: string;
    name: string;
    domain: string;
    trackedKeywords: number;
    avgRank: number | null;
    topCompetitors: Array<{ domain: string; count: number }>;
    snapshots: Array<{
      id: string;
      gscClicks: number | null;
      gscImpressions: number | null;
    }>;
  };
};

export function ProjectCard({ clientName, project }: ProjectCardProps) {
  const totalClicks = project.snapshots.reduce((sum, item) => sum + (item.gscClicks ?? 0), 0);
  const totalImpressions = project.snapshots.reduce((sum, item) => sum + (item.gscImpressions ?? 0), 0);

  return (
    <Card className="overflow-hidden border-white/60 bg-white/85 backdrop-blur">
      <CardHeader className="border-b border-slate-200/70 bg-slate-50/90">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardDescription>{clientName}</CardDescription>
            <CardTitle className="mt-1 text-slate-950">{project.name}</CardTitle>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{project.avgRank ? `Avg ${project.avgRank.toFixed(1)}` : "Sin SERP"}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Globe2 className="h-4 w-4" />
          <span>{project.domain}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-950 p-4 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Keywords</p>
            <p className="mt-2 text-2xl font-semibold">{formatNumber(project.trackedKeywords)}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Clicks</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatNumber(totalClicks)}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Impr.</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatNumber(totalImpressions)}</p>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-800">
            <TrendingUp className="h-4 w-4" />
            Competidores por encima
          </div>
          <div className="space-y-2">
            {project.topCompetitors.length > 0 ? (
              project.topCompetitors.map((competitor) => (
                <div key={competitor.domain} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <span>{competitor.domain}</span>
                  <span className="font-medium text-slate-500">{competitor.count} keywords</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Aun no hay snapshots de competidores para este proyecto.</p>
            )}
          </div>
        </div>

        <form action={`/api/projects/${project.id}/sync`} method="post">
          <Button className="w-full justify-between">
            Ejecutar sync manual
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

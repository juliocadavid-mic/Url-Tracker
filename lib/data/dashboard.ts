import { prisma } from "@/lib/prisma";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getDashboardData() {
  const today = startOfToday();

  const agencies = await prisma.agency.findMany({
    include: {
      clients: {
        include: {
          projects: {
            include: {
              keywords: true,
              keywordSnapshots: {
                where: {
                  snapshotDate: today
                },
                include: {
                  competitors: {
                    include: {
                      competitorDomain: true
                    }
                  },
                  keyword: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return agencies.map((agency) => ({
    id: agency.id,
    name: agency.name,
    clients: agency.clients.map((client) => ({
      id: client.id,
      name: client.name,
      projects: client.projects.map((project) => {
        const snapshots = project.keywordSnapshots;
        const trackedKeywords = project.keywords.length;
        const avgRank =
          snapshots.length > 0
            ? snapshots.reduce((acc, item) => acc + (item.serpRank ?? 0), 0) / snapshots.filter((item) => item.serpRank !== null).length
            : null;

        const topCompetitors = snapshots
          .flatMap((snapshot) => snapshot.competitors.map((competitor) => competitor.competitorDomain.domain))
          .reduce<Record<string, number>>((acc, domain) => {
            acc[domain] = (acc[domain] ?? 0) + 1;
            return acc;
          }, {});

        return {
          id: project.id,
          name: project.name,
          domain: project.primaryDomain,
          trackedKeywords,
          avgRank: Number.isFinite(avgRank) ? avgRank : null,
          topCompetitors: Object.entries(topCompetitors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([domain, count]) => ({ domain, count })),
          snapshots
        };
      })
    }))
  }));
}

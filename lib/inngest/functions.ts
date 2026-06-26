import { prisma } from "@/lib/prisma";
import { fetchSearchConsoleMetrics } from "@/lib/clients/search-console";
import { fetchLiveSerpRanking } from "@/lib/clients/serper";
import { getDomainFromUrl } from "@/lib/utils";
import { inngest } from "@/lib/inngest/client";

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date = new Date()) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export const syncProjectSeo = inngest.createFunction(
  { id: "sync-project-seo" },
  { event: "project/sync.requested" },
  async ({ event, step }) => {
    const projectId = event.data.projectId as string;
    const snapshotDate = startOfDay(new Date(event.data.snapshotDate ?? new Date()));

    const project = await step.run("load-project", async () => {
      return prisma.project.findUnique({
        where: { id: projectId },
        include: {
          keywords: true,
          seoNodes: {
            where: {
              type: "URL"
            }
          }
        }
      });
    });

    if (!project) {
      throw new Error(`Project ${projectId} not found.`);
    }

    const gscRun = await prisma.syncRun.create({
      data: {
        projectId,
        provider: "GOOGLE_SEARCH_CONSOLE",
        status: "running",
        metadata: {
          snapshotDate
        }
      }
    });

    const serpRun = await prisma.syncRun.create({
      data: {
        projectId,
        provider: "SERPER",
        status: "running",
        metadata: {
          snapshotDate
        }
      }
    });

    const gscRows = project.gscPropertyUrl
      ? await step.run("fetch-gsc", async () =>
          fetchSearchConsoleMetrics({
            propertyUrl: project.gscPropertyUrl!,
            startDate: toIsoDate(snapshotDate),
            endDate: toIsoDate(snapshotDate)
          })
        )
      : [];

    const rowsByKeyword = new Map(gscRows.map((row) => [`${row.keyword}::${row.page}`, row]));
    const domain = getDomainFromUrl(project.primaryDomain);

    for (const keyword of project.keywords) {
      await step.run(`sync-keyword-${keyword.id}`, async () => {
        const serp = await fetchLiveSerpRanking({
          keyword: keyword.term,
          domain,
          countryCode: project.countryCode,
          languageCode: project.languageCode
        });

        const target = await prisma.keywordTarget.findFirst({
          where: {
            keywordId: keyword.id,
            priority: "PRIMARY"
          },
          include: {
            seoNode: true
          }
        });

        const gscMatch = target?.seoNode.url
          ? rowsByKeyword.get(`${keyword.term}::${target.seoNode.url}`)
          : undefined;

        const snapshot = await prisma.keywordSnapshot.upsert({
          where: {
            keywordId_snapshotDate: {
              keywordId: keyword.id,
              snapshotDate
            }
          },
          update: {
            projectId: project.id,
            seoNodeId: target?.seoNodeId,
            gscAveragePosition: gscMatch?.position,
            gscClicks: gscMatch?.clicks,
            gscImpressions: gscMatch?.impressions,
            gscCtr: gscMatch?.ctr,
            serpRank: serp.rank,
            serpUrl: serp.resultUrl,
            topCompetitorDomain: serp.competitors[0]?.domain
          },
          create: {
            projectId: project.id,
            keywordId: keyword.id,
            seoNodeId: target?.seoNodeId,
            snapshotDate,
            gscAveragePosition: gscMatch?.position,
            gscClicks: gscMatch?.clicks,
            gscImpressions: gscMatch?.impressions,
            gscCtr: gscMatch?.ctr,
            serpRank: serp.rank,
            serpUrl: serp.resultUrl,
            topCompetitorDomain: serp.competitors[0]?.domain
          }
        });

        await prisma.competitorSnapshot.deleteMany({
          where: {
            keywordSnapshotId: snapshot.id
          }
        });

        for (const competitor of serp.competitors) {
          const competitorDomain = await prisma.competitorDomain.upsert({
            where: {
              projectId_domain: {
                projectId: project.id,
                domain: competitor.domain
              }
            },
            update: {
              displayName: competitor.domain
            },
            create: {
              projectId: project.id,
              domain: competitor.domain,
              displayName: competitor.domain
            }
          });

          await prisma.competitorSnapshot.create({
            data: {
              keywordSnapshotId: snapshot.id,
              competitorDomainId: competitorDomain.id,
              rank: competitor.position,
              resultUrl: competitor.url,
              title: competitor.title
            }
          });
        }
      });
    }

    await step.run("mark-sync-runs-complete", async () => {
      const finishedAt = new Date();

      await prisma.syncRun.update({
        where: {
          id: gscRun.id
        },
        data: {
          status: "completed",
          finishedAt
        }
      });

      await prisma.syncRun.update({
        where: {
          id: serpRun.id
        },
        data: {
          status: "completed",
          finishedAt
        }
      });
    });

    return {
      projectId,
      snapshotDate: snapshotDate.toISOString()
    };
  }
);

export const inngestFunctions = [syncProjectSeo];

import { env } from "@/lib/env";
import { getDomainFromUrl } from "@/lib/utils";

type SerpCompetitor = {
  position: number;
  domain: string;
  url: string;
  title: string;
};

export type SerpKeywordSnapshot = {
  rank: number | null;
  resultUrl: string | null;
  competitors: SerpCompetitor[];
};

type SerperOrganicResult = {
  position: number;
  link?: string;
  title?: string;
};

export async function fetchLiveSerpRanking(params: {
  keyword: string;
  domain: string;
  countryCode: string;
  languageCode: string;
}) {
  if (!env.SERPER_API_KEY) {
    throw new Error("SERPER_API_KEY is not configured.");
  }

  const rawResponse = await fetch("https://google.serper.dev/search", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.SERPER_API_KEY
    },
    body: JSON.stringify({
      q: params.keyword,
      gl: params.countryCode,
      hl: params.languageCode,
      num: 10
    })
  });

  if (!rawResponse.ok) {
    throw new Error(`Serper request failed with status ${rawResponse.status}`);
  }

  const response = (await rawResponse.json()) as {
    organic?: SerperOrganicResult[];
  };

  const organicResults = response.organic ?? [];

  let rank: number | null = null;
  let resultUrl: string | null = null;

  const competitors = organicResults
    .filter((result) => !!result.link)
    .map((result) => {
      const url = result.link ?? "";
      const domain = getDomainFromUrl(url);

      if (domain === params.domain && rank === null) {
        rank = result.position;
        resultUrl = url;
      }

      return {
        position: result.position,
        domain,
        url,
        title: result.title ?? ""
      };
    })
    .filter((result) => result.domain !== params.domain);

  return {
    rank,
    resultUrl,
    competitors
  } satisfies SerpKeywordSnapshot;
}

import { google, searchconsole_v1 } from "googleapis";

import { env } from "@/lib/env";

function getAuthClient() {
  const clientEmail = env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const privateKey = env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Google Search Console credentials are not configured.");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"]
  });
}

export type GscKeywordRow = {
  keyword: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function fetchSearchConsoleMetrics(params: {
  propertyUrl: string;
  startDate: string;
  endDate: string;
}) {
  const client = google.searchconsole({
    version: "v1",
    auth: getAuthClient()
  });

  const response = await client.searchanalytics.query({
    siteUrl: params.propertyUrl,
    requestBody: {
      startDate: params.startDate,
      endDate: params.endDate,
      dimensions: ["query", "page"],
      rowLimit: 25000
    }
  });

  const rows = response.data.rows ?? [];

  return rows.map<GscKeywordRow>((row: searchconsole_v1.Schema$ApiDataRow) => ({
    keyword: row.keys?.[0] ?? "",
    page: row.keys?.[1] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0
  }));
}

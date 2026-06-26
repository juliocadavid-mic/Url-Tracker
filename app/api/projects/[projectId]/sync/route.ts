import { NextResponse } from "next/server";

import { inngest } from "@/lib/inngest/client";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;

  await inngest.send({
    name: "project/sync.requested",
    data: {
      projectId: params.projectId,
      snapshotDate: new Date().toISOString()
    }
  });

  return NextResponse.redirect(new URL("/dashboard", request.url), 303);
}

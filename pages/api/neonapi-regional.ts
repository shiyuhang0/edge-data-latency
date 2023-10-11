import { neon, neonConfig } from "@neondatabase/serverless";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
  regions: ["iad1"],
};

neonConfig.fetchConnectionCache = true;

const start = Date.now();

export default async function api(req: Request, ctx: any) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  const sql = neon(process.env.NEON_DATABASE_URL);

  let data = null;
  const url = new URL('/sql1', `https://ep-damp-snowflake-71417527.us-east-1.aws.neon.tech`)
  for (let i = 0; i < count; i++) {
    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'TiDB-Database': 'employees',
          'TiDB-Session': ''
        },
        cache: 'no-store'
      })
    } catch (e) {
    }
  }

  return Response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
    invocationRegion: (req.headers.get("x-vercel-id") ?? "").split(":")[1] || null,
  }, {
    headers: { "x-edge-is-cold": start === time ? "1" : "0" },
  });
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}

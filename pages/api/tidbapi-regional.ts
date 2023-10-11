import { NextRequest as Request, NextResponse as Response } from 'next/server';
import { connect } from '@tidbcloud/serverless';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

const start = Date.now();

export default async function api(req: Request, ctx: any) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  const host = process.env.TiDB_DATABASE_URL

  const url = new URL('/v1beta/sql1', `https://http-gateway01.us-east-1.prod.aws.tidbcloud.com`)

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
      console.log(e)
    }
  }

  return Response.json({
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}

// convert a query parameter to a number, applying a min and max, defaulting to 1
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? 1 : Math.min(Math.max(num, min), max);
}

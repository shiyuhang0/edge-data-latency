import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
  regions: ["iad1"],
};

interface EmployeeTable {
  emp_no: number;
  first_name: string;
  last_name: string;
}

interface Database {
  employees: EmployeeTable;
}

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  }),
});

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  const url = new URL('/psdb.v1alpha1.Database/Execute1', `https://aws.connect.psdb.cloud`)
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

  return Response.json(
      {
        data,
        queryDuration: Date.now() - time,
        invocationIsCold: start === time,
        invocationRegion:
            (req.headers.get("x-vercel-id") ?? "").split(":")[1] || null,
      },
      {
        headers: {
          "x-edge-is-cold": start === time ? "1" : "0",
        },
      }
  );
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}

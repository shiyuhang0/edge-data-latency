import { NextApiRequest, NextApiResponse } from 'next';
import {connect} from "@tidbcloud/serverless";

const start = Date.now();

export default async function api(request: NextApiRequest,
                                  response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();

  const url = new URL('/v1beta/sql1', `https://http-gateway01.us-east-1.dev.shared.aws.tidbcloud.com`)
  const auth =  process.env.Authorization

  let data = null;
  for (let i = 0; i < count; i++) {
    const resp = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth
        },
        body: JSON.stringify({"query":"show databases"}),
        cache: 'no-store'
      })
    data = await resp.json()
  }

  return response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}
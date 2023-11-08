import { NextApiRequest, NextApiResponse } from 'next';
import {connect} from "@tidbcloud/serverless";

const start = Date.now();

export default async function api(request: NextApiRequest,
                                  response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();

  const url = new URL('/v1beta/sql1', `https://http-gateway01.us-east-1.prod.aws.tidbcloud.com`)
  const auth =  process.env.Authorization

  for (let i = 0; i < count; i++) {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth
        },
        cache: 'no-store'
      })
  }

  return response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}
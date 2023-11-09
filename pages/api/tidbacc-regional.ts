import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const start = Date.now();

export default async function api(request: NextApiRequest,
                                  response: NextApiResponse) {
  const count = Number(request.query.count);
  const time = Date.now();

  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST2,
    port: 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: 'test',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  let data = null;
  for (let i = 0; i < count; i++) {
    data = await connection.execute(`
      show databases`)
  }

  console.log(data)
  console.log(start === time)

  return response.json({
    data,
    queryDuration: Date.now() - time,
    invocationIsCold: start === time,
  });
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  await fetch("http://localhost:8000/restricted", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  })
    .then((r) => r.text())
    .then((data) => {
      res.end(data);
    });
}

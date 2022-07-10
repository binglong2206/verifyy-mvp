// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({
    data: "123838383",
  });
}

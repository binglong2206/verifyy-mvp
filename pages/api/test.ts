// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

type Data = {
  name: string;
};

const session = { sessionId: 0, username: 7777 };
const accessToken = jwt.sign({ username: 7777 }, "process.env.JWT_ACCESS_KEY");
const refreshToken = jwt.sign(session, " process.env.JWT_REFRESH_KEY");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("sadasd", req.cookies);
  res.status(200).json({ name: "John Doe" });
}

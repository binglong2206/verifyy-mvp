// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { User } from "./db/entity/User";
import { AppDataSource } from "./db/data-source";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") throw new Error("No Access");
  // Clear all cookies
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "clear", {
      maxAge: 0,
      path: "/",
    }),
    serialize("refreshToken", "clear", {
      maxAge: 0,
      path: "/",
    }),
  ]);

  res.send("cookies cleared");
}

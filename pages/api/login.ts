// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ username: "Timber", password: "1234" }),
  })
    .then((r) => r.json())
    .then((data) => {
      res.setHeader("Set-Cookie", [
        serialize("accessToken", data.accessToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          sameSite: true,
          secure: true,
          path: "/",
        }),
        serialize("refreshToken", data.refreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
          sameSite: true,
          secure: true,
          path: "/",
        }),
      ]);

      res.json(data);
    });
}

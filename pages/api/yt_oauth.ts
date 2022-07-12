// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accessToken, refreshToken } = req.cookies;
  console.log(accessToken);

  const csrfState = Math.random().toString(36).substring(2);
  res.setHeader("Set-Cookie", [
    cookie.serialize("yt_csrf", csrfState, { maxAge: 300 }),
    cookie.serialize("web_accessToken", accessToken as string, {
      maxAge: 300,
    }),
    cookie.serialize("web_refreshToken", refreshToken as string, {
      maxAge: 300,
    }),
  ]);

  let url = "https://accounts.google.com/o/oauth2/v2/auth";

  url += `?client_id=${process.env.YT_CLIENT_ID}`;
  url += "&redirect_uri=http://localhost:3000/api/yt_data";
  url += "&response_type=code";
  url +=
    "&scope=https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly";
  url += "&include_granted_scopes=true";
  url += "&state=" + csrfState;

  res.redirect(url);
}

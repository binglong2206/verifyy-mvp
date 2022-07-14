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

  const csrfState = Math.random().toString(36).substring(2);
  res.setHeader("Set-Cookie", [
    cookie.serialize("ig_csrf", csrfState, { maxAge: 30 }),
    cookie.serialize("web_accessToken", accessToken as string, {
      maxAge: 30,
    }),
    cookie.serialize("web_refreshToken", refreshToken as string, {
      maxAge: 30,
    }),
  ]);

  let url = "https://www.facebook.com/v14.0/dialog/oauth";

  url += `?client_id=${process.env.FB_CLIENT_ID}`;
  url += "&redirect_uri=http://localhost:3000/api/ig_data";
  url += "&response_type=code";
  url +=
    "&scope=instagram_basic,pages_show_list,instagram_manage_insights,read_insights";
  // url += "&state=" + csrfState;

  res.redirect(url);
}

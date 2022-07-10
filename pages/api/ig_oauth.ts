// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const csrfState = Math.random().toString(36).substring(2);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("fb_csrf", csrfState, { maxAge: 60000 })
  );

  let url = "https://www.facebook.com/v14.0/dialog/oauth";

  url += `?client_id=${process.env.FB_CLIENT_ID}`;
  url += "&redirect_uri=http://localhost:3000/api/fb_data";
  url += "&response_type=code";
  url +=
    "&scope=instagram_basic,pages_show_list,instagram_manage_insights,pages_read_engagement";
  url += "&state=" + csrfState;

  res.redirect(url);
}

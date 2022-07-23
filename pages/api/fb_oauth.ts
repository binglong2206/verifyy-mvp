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

  res.setHeader("Set-Cookie", [
    cookie.serialize("web_accessToken", accessToken as string, {
      maxAge: 300,
    }),
    cookie.serialize("web_refreshToken", refreshToken as string, {
      maxAge: 300,
    }),
  ]);

  let url = "https://www.facebook.com/v14.0/dialog/oauth";

  url += `?client_id=${process.env.FB_CLIENT_ID}`;
  url += "&redirect_uri=http://localhost:3000/api/fb_data";
  url += "&response_type=code";
  url +=
    "&scope=pages_show_list,pages_read_engagement,pages_read_user_content,read_insights";
    
  res.redirect(url);
}

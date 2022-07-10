import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import cookie from "cookie";

/***API ACCESS IN REVIEW  */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const csrfState = Math.random().toString(36).substring(2);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("csrfState", csrfState, { maxAge: 60000 })
  );

  let url = "https://www.tiktok.com/auth/authorize/";

  url += "?client_key={CLIENT_KEY}";
  url += "&scope=user.info.basic,video.list";
  url += "&response_type=code";
  url += "&redirect_uri={SERVER_ENDPOINT_REDIRECT}";
  url += "&state=" + csrfState;

  res.redirect(url);
}

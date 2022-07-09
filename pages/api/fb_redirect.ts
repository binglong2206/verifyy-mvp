// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get Code, AccessToken, PageId, InstagramName, InstagramId
  console.log("log");
  const code = req.url?.split("code=")[1];
  const accessToken = await fetch(
    `https://graph.facebook.com/v14.0/oauth/access_token?client_id=${process.env.FB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/fb_redirect&client_secret=${process.env.FB_CLIENT_SECRET}&code=${code}` // it doesnt actually redirect
  )
    .then((r) => r.json())
    .then((json) => json.access_token);

  const { name, id } = await fetch(
    `https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`
  )
    .then((r) => r.json())
    .then((json) => json.data[0]);

  const instagramId = await fetch(
    `https://graph.facebook.com/v14.0/${id}?fields=instagram_business_account&access_token=${accessToken}`
  )
    .then((r) => r.json())
    .then((json) => json.instagram_business_account.id);

  // Start Query
  const queryResult = await fetch(
    `https://graph.facebook.com/v14.0/${instagramId}?fields=business_discovery.username(${name}){followers_count,media_count,media{comments_count,like_count,media_url}}&access_token=${accessToken}`
  ).then((r) => r.json());

  res.send(queryResult);

  // Request Access Token
}

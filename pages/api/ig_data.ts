// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

interface IG_data {
  username: string;
  follower_count: number;
  media_count: number;
  demographics: any; // refer to ig_demo_geo.json
  geographics: any; // refer to ig_demo_geo.json
  medias: {
    like_count: string;
    id: string;
    media_url: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get Code, AccessToken
  const code = req.url?.split("code=")[1];

  const accessToken = await fetch(
    `https://graph.facebook.com/v14.0/oauth/access_token?client_id=${process.env.FB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/ig_data&client_secret=${process.env.FB_CLIENT_SECRET}&code=${code}` // redirect & resume at this point
  )
    .then((r) => r.json())
    .then((json) => json.access_token);

  // Get pageName and pageId to get instagramID
  const { name, id } = await fetch(
    `https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`
  )
    .then((r) => r.json())
    .then((json) => json.data[1]); // select first

  const instagramId = await fetch(
    `https://graph.facebook.com/v14.0/${id}?fields=instagram_business_account&access_token=${accessToken}`
  )
    .then((r) => r.json())
    .then((json) => json.instagram_business_account.id);

  // Get username, follower_count, media_count, mediaIds(5)
  const { username, followers_count, media_count, media } = await fetch(
    `https://graph.facebook.com/v14.0/${instagramId}?fields=username,followers_count,media_count,media.limit(5){like_count,comment_count,media_url}&access_token=${accessToken}`
  ).then((r) => r.json());

  // Get demographics & geographics
  const agg_demographics_geographics = await fetch(
    `https://graph.facebook.com/v14.0/${instagramId}/insights?metric=audience_gender_age,audience_country&period=lifetime&access_token=${accessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));
  const demographics = agg_demographics_geographics.data[0].values[0].value;
  const geographics = agg_demographics_geographics.data[1].values[0].value;

  const organized_data: IG_data = {
    username: username,
    follower_count: followers_count,
    media_count: media_count,
    demographics: demographics,
    geographics: geographics,
    medias: media.data,
  };
  // console.log('ORGANIZED IG DATA: ', organized_data)

  // Post DB to let controller insert, redirect to edit to then query inserted data
  await fetch("http://localhost:8000/instagram", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      authorization: JSON.stringify(req.cookies),
    },
    body: JSON.stringify(organized_data),
  }).then(() => res.redirect("/redirect_edit"));
  // res.redirect("/redirect_edit");
}

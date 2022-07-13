// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

interface FB_data {
  follower_count: number;
  like_count: number;
  media_count: number;
  demographics: [string, string, number][];
  geographics: [string, number][];
  medias: {
    title: string;
    view_count: number;
    like_count: number;
    comment_count: number;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("COOKIES: ", req.cookies);

  // Get Code from redirect URL
  const code = req.url?.split("code=")[1];

  // Get Access Token from redirected URL
  const accessToken = await fetch(
    `https://graph.facebook.com/v14.0/oauth/access_token?client_id=${process.env.FB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/fb_data&client_secret=${process.env.FB_CLIENT_SECRET}&code=${code}` // redirect & resume back here
  )
    .then((r) => r.json())
    .then((json) => json.access_token)
    .catch((e) => console.error(e));

  // Get Page ID, will have multiple page ID if user select many. Just query the first if so.
  const pageList = await fetch(
    `https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));
  const pageId = pageList.data[0].id;

  // Get followers & likes, fan_count -> likes
  const { followers_count, fan_count } = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}?fields=followers_count,fan_count&access_token=${accessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));
  console.log("FOLLWERS, LIKES", followers_count, fan_count);

  // Get Page ACCESS token to use "insights" & "published_posts" api route
  const pageAccessToken = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}?fields=access_token&access_token=${accessToken}`
  )
    .then((r) => r.json())
    .then((json) => json.access_token)
    .catch((e) => console.error(e));

  // Get 5 recent post lists, along with summary total posts count
  const post_list = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}/published_posts?summary=total_count&limit=5&fields=id&access_token=${pageAccessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));
  console.log("POST LIST HEREEEE: ", post_list);
  const media_count = post_list.summary.total_count;
  const postIds = post_list.data.map((e: { id: string }) => {
    return e.id;
  });
  console.log("MEDIA_COUNT", media_count);
  console.log("5 post ids", postIds);

  // Get demographics & geographics
  const agg_demographics_geographics = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}/insights?metric=page_fans_gender_age,page_fans_country&access_token=${pageAccessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));
  const demographics = agg_demographics_geographics.data[0].values[0].value;
  const geographics = agg_demographics_geographics.data[1].values[0].value;
  console.log("DEMOGRAPHICS", demographics);
  console.log("GEOGRAPHICS", geographics);

  res.end();

  // const { name, id } = await fetch(
  //   `https://graph.facebook.com/v14.0/me/accounts?access_token=${accessToken}`
  // )
  //   .then((r) => r.json())
  //   .then((json) => json.data[0]);

  // const instagramId = await fetch(
  //   `https://graph.facebook.com/v14.0/${id}?fields=instagram_business_account&access_token=${accessToken}`
  // )
  //   .then((r) => r.json())
  //   .then((json) => json.instagram_business_account.id);

  // // Start Query
  // const queryResult = await fetch(
  //   `https://graph.facebook.com/v14.0/${instagramId}?fields=business_discovery.username(${name}){followers_count,media_count,media{comments_count,like_count,media_url}}&access_token=${accessToken}`
  // ).then((r) => r.json());

  // Save datas in DB & redirect to dashboard that then auto request data from DB
  // await fetch("http://localhost:8000/fb", {
  //   method: "POST",
  //   credentials: "include",
  //   headers: {
  //     "content-type": "application/json",
  //   },
  //   body: JSON.stringify(queryResult),
  // })
  //   .then((r) => r.text())
  //   .then(() => res.redirect("/signup"));
}

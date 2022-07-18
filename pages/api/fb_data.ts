// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

interface Media {
  media_url: string;
  src_url: string;
  like_count: number;
  comment_count: number;
  impression_count: number;
}

interface FB_data {
  follower_count: number;
  like_count: number;
  media_count: number;
  demographics: any; // refer to fb_demo_geo.json
  geographics: any; // refer to fb_demo_geo.json
  medias: Media[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  const pageId = pageList.data[0].id; // Glory Trading Page

  // Get followers & likes, fan_count -> likes
  const { followers_count, fan_count } = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}?fields=followers_count,fan_count&access_token=${accessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));

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
  const media_count = post_list.summary.total_count;
  const postIds = post_list.data.map((e: { id: string }) => {
    return e.id;
  });

  // Get all media stats -> like_count, comment_count, imprression, url, img
  const raw_media_list = await fetch(
    `https://graph.facebook.com/v14.0/?ids=${postIds.toString()}&fields=permalink_url,picture,likes.limit(1).summary(true),comments.limit(1).summary(true),insights.metric(post_impressions)&access_token=${pageAccessToken}`
  ).then((r) => r.json());

  // Organize medias query -> {id, url, picture, like_count, comment_count, impression_count}[]
  const media_list: Media[] = [];
  for (let key in raw_media_list) {
    let holder: any = {};
    holder.src_url = raw_media_list[key].permalink_url;
    holder.media_url = raw_media_list[key].picture;
    holder.like_count = raw_media_list[key].likes.summary.total_count;
    holder.comment_count = raw_media_list[key].comments.summary.total_count;
    holder.impression_count =
      raw_media_list[key].insights.data[0].values[0].value;

    const media: Media = holder;
    media_list.push(media);
  }

  // Get demographics & geographics
  const agg_demographics_geographics = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}/insights?metric=page_fans_gender_age,page_fans_country&access_token=${pageAccessToken}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));
  const demographics = agg_demographics_geographics.data[0].values[0].value;
  const geographics = agg_demographics_geographics.data[1].values[0].value;

  const organized_data: FB_data = {
    follower_count: followers_count,
    like_count: fan_count,
    media_count: media_count,
    demographics: demographics,
    geographics: geographics,
    medias: media_list,
  };

  await fetch("http://localhost:8000/facebook", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      authorization: JSON.stringify(req.cookies),
    },
    body: JSON.stringify(organized_data),
  }).then(() => res.redirect("/redirect_edit"));
}

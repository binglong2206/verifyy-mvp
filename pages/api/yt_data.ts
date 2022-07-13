// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";
import axios from "axios";

interface VideoDetails {
  kind: string;
  etag: string;
  id: string;
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Match yt_csrf with cookie
  const csrfState = req.url
    ?.substring(req.url?.indexOf("state="), req.url?.indexOf("&code="))
    .split("state=")[1];
  if (req.cookies.yt_csrf !== csrfState) res.end("csrf invalid");

  // Get Code
  const code = req.url
    ?.substring(req.url?.indexOf("&code="), req.url?.indexOf("&scope="))
    .split("code=")[1];

  // // Get Access Token
  const yt_accessToken = await fetch(
    `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.YT_CLIENT_ID}&client_secret=${process.env.YT_CLIENT_SECRET}&redirect_uri=http://localhost:3000/api/yt_data&grant_type=authorization_code`,
    {
      method: "POST",
    }
  )
    .then((r) => r.json())
    .then((json) => json.access_token);

  // Youtube Data API -> Channel Stats
  const channelStats = await fetch(
    `https://youtube.googleapis.com/youtube/v3/channels?mine=true&part=snippet,contentDetails,statistics&key=${process.env.YT_API_KEY}`
  )
    .then((r) => r.json())
    .catch((e) => console.error(e));

  // Youtube Data API -> Get top 5 videos from 'Uploads' playlist
  const playlistId = channelStats.items.contentDetails.relatedPlaylists.uploads;
  const uploadPlaylist = await fetch(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=5&playlistId=${playlistId}&key=${process.env.YT_API_KEY}`
  ).then((r) => r.json());
  const videoIdList = <string[]>uploadPlaylist.items.map((e: VideoDetails) => {
    return e.contentDetails.videoId;
  });

  const videoStats = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=Ks-_Mh1QhMc,c0KYU2j0TM4,eIho2S0ZahI&key=${process.env.YT_API_KEY}`
  )
    .then((r) => r.json())

    // Youtube Analytics API -> Demographics (age&gender)

    // Youtube Analytics API -> Geographics (Country by views)

    // const queryResult = await fetch(
    //   `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2022-02-19&endDate=2022-02-22&metrics=views&dimensions=day&sort=day&access_token=${yt_accessToken}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => data);

    // Post query result to DB

    .console.log(req.cookies);

  await fetch("http://localhost:8000/yt", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      // Send this to backend to verify auth header
      Authorization: JSON.stringify(req.cookies),
    },
    body: JSON.stringify({ test: "whatver" }),
  }).then(() => res.redirect("/redirect_edit"));

  // Redirect to edit, use special url to Router.push back via client so can include cookie
  // res.redirect("/redirect_edit");
}

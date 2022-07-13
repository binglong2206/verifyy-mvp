// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";
import axios from "axios";
import date from "date-and-time";

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
    `https://youtube.googleapis.com/youtube/v3/channels?mine=true&part=snippet,contentDetails,statistics&access_token=${yt_accessToken}`
  ).then((r) => r.json());

  // // Youtube Data API -> Get top 5 videos from 'Uploads' playlist
  const playlistId =
    channelStats.items[0].contentDetails.relatedPlaylists.uploads;
  const uploadPlaylist = await fetch(
    `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=5&playlistId=${playlistId}&key=${process.env.YT_API_KEY}`
  ).then((r) => r.json());
  const videoIdList = <string[]>uploadPlaylist.items.map((e: VideoDetails) => {
    return e.contentDetails.videoId;
  });
  console.log("VIDEO ID LIST: ", videoIdList);

  const videoStats = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=${videoIdList.toString()}&key=${
      process.env.YT_API_KEY
    }`
  ).then((r) => r.json());
  console.log("VIDEO STATS: ", videoStats);

  // Youtube Analytics API -> Demographics (age&gender)
  const dateNow = new Date();
  const formattedDate = date.format(dateNow, "YYYY-MM-DD");
  const demographicStats = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=ageGroup,gender&startDate=2000-05-01&endDate=${formattedDate}&ids=channel==MINE&metrics=viewerPercentage&sort=gender,ageGroup&access_token=${yt_accessToken}`
  ).then((r) => r.json());
  console.log("DEMOGRAPHIC: ", demographicStats);

  // Youtube Analytics API -> Geographics (Country by views)
  const geographicStats = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&startDate=2000-05-01&endDate=${formattedDate}&ids=channel==MINE&metrics=views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained&sort=-views&access_token=${yt_accessToken}`
  ).then((r) => r.json());
  console.log("GEOGRAPHICS: ", geographicStats);

  // Organize all data into single object

  // Post data as json to DB's controller
  // await fetch("http://localhost:8000/yt", {
  //   method: "POST",
  //   credentials: "include",
  //   headers: {
  //     "content-type": "application/json",
  //     // Send this to backend to verify auth header
  //     Authorization: JSON.stringify(req.cookies),
  //   },
  //   body: JSON.stringify({ test: "whatver" }),
  // }).then(() => res.redirect("/redirect_edit"));

  // Redirect to edit, use special url to Router.push back via client so can include cookie
  res.redirect("/redirect_edit");
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";
import axios from "axios";
import date from "date-and-time";
import {fetchBasicStat,fetchDemoGeo,fetchIntervalData} from '../../api/youtube_utils'

interface PlaylistItem {
  kind: string;
  etag: string;
  id: string;
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

interface VideoStat {
  kind: string;
  etag: string;
  id: string;
  snippet: any;
  contentDetails: any;
  statistics: any;
  player: any;
}

interface IntervalData { // date, view, likes, subsGained
  day: [string, number, number, number][]
  week: [string, number, number, number][]
  month: [string, number, number, number][]
}

interface YT_data {
  follower_count: number;
  view_count: number;
  media_count: number;
  demographics: [string, string, number][];
  geographics: [string, number][];
  data_intervals: IntervalData;
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

  // // Youtube Data API -> Channel Stats -> sub,view,uplaods
  // const channelStats = await fetch(
  //   `https://youtube.googleapis.com/youtube/v3/channels?mine=true&part=snippet,contentDetails,statistics&access_token=${yt_accessToken}`
  // ).then((r) => r.json());
  // const { viewCount, subscriberCount, videoCount } =
  //   channelStats.items[0].statistics;

  // // // Youtube Data API -> Get top 5 videos from 'Uploads' playlist
  // const playlistId =
  //   channelStats.items[0].contentDetails.relatedPlaylists.uploads;

  // const uploadPlaylist = await fetch(
  //   `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=5&playlistId=${playlistId}&key=${process.env.YT_API_KEY}`
  // ).then((r) => r.json());
  // const videoIdList = <string[]>uploadPlaylist.items.map((e: PlaylistItem) => {
  //   return e.contentDetails.videoId;
  // });

  // const videoStatsList = await fetch(
  //   `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=${videoIdList.toString()}&key=${
  //     process.env.YT_API_KEY
  //   }`
  // ).then((r) => r.json());

  // const videoObjects = videoStatsList.items.map((e: VideoStat) => {
  //   return {
  //     title: e.snippet.title,
  //     view_count: e.statistics.viewCount,
  //     like_count: e.statistics.likeCount,
  //     comment_count: e.statistics.commentCount,
  //   };
  // });

  // // Youtube Analytics API -> Demographics (age&gender)
  // const dateNow = new Date();
  // const formattedDateNow = date.format(dateNow, "YYYY-MM-DD");
  // const demographics = await fetch(
  //   `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=ageGroup,gender&startDate=2000-05-01&endDate=${formattedDateNow}&ids=channel==MINE&metrics=viewerPercentage&sort=gender,ageGroup&access_token=${yt_accessToken}`
  // ).then((r) => r.json()).then(json=> json.rows)

  // // Youtube Analytics API -> Geographics (Country by views)
  // const geographics = await fetch(
  //   `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&startDate=2000-05-01&endDate=${formattedDateNow}&ids=channel==MINE&metrics=views&sort=views&access_token=${yt_accessToken}`
  // ).then((r) => r.json()).then(json=>json.rows);



    // Youtube Data API -> lifetime basic stats, and latest 5 videos stat
    const {viewCount, subscriberCount, videoCount, videoObjects} = await fetchBasicStat(yt_accessToken);

    // Youtube Analytics API -> lifetime demographcis & geographics
    const {demographics, geographics} = await fetchDemoGeo(yt_accessToken);

    // Youtube Analytics API -> day/week/28 for views, likes, subsGained
    const {data_intervals } = await fetchIntervalData(yt_accessToken)




  // Organize all data into single object
  const organized_data: YT_data = {
    follower_count: subscriberCount,
    view_count: viewCount,
    media_count: videoCount,
    demographics: demographics,         
    geographics: geographics,                 
    medias: videoObjects,
    data_intervals: data_intervals,
  };

  // // Post data as json to DB's controller
  // await fetch("http://localhost:8000/youtube", {
  //   method: "POST",
  //   credentials: "include",
  //   headers: {
  //     "content-type": "application/json",
  //     // Send this to backend to verify auth header again
  //     Authorization: JSON.stringify(req.cookies),
  //   },
  //   body: JSON.stringify(organized_data),
  // })
  //   .then(() => res.redirect("/redirect_edit"))
  //   .catch((e) => console.error(e));

  res.redirect("/redirect_edit");
}

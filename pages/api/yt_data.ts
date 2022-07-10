// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { rawListeners } from "process";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Match yt_csrf with cookie
  // Get Code
  const code = req.url
    ?.substring(req.url?.indexOf("&code="), req.url?.indexOf("&scope="))
    .split("code=")[1];
  console.log(code);

  // Get Access Token
  const accessToken = await fetch(
    `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.YT_CLIENT_ID}&client_secret=${process.env.YT_CLIENT_SECRET}&redirect_uri=http://localhost:3000/api/yt_data&grant_type=authorization_code`,
    {
      method: "POST",
    }
  )
    .then((r) => r.json())
    .then((json) => json.access_token);

  // Make query
  const queryResult = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2022-01-01&endDate=2022-02-22&metrics=views&dimensions=day&sort=day&access_token=${accessToken}`
  )
    .then((res) => res.json())
    .then((data) => data);

  // Post query result to DB
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

  // Redirect to dashboard
  res.send(queryResult);
}

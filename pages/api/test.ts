import date from "date-and-time";


export async function fetchData (yt_accessToken) {
    let day,week,month;
    day = week = month = new Date()
    week.setDate(week.getDate()-7)
    month.setDate(month.getDate()-28)
    const dayFormat = date.format(day, "YYYY-MM-DD");
    const weekFormat = date.format(week, "YYYY-MM-DD");
    const monthFormat = date.format(month, "YYYY-MM-DD");

    
    const views_day = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&startDate=2000-05-01&endDate=${dayFormat}&ids=channel==MINE&metrics=views&sort=-views&access_token=${yt_accessToken}`
      ).then((r) => r.json()); 

    const likes_day = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&startDate=2000-05-01&endDate=${dayFormat}&ids=channel==MINE&metrics=views&sort=-views&access_token=${yt_accessToken}`
      ).then((r) => r.json()); 

    const followers_day = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&startDate=2000-05-01&endDate=${dayFormat}&ids=channel==MINE&metrics=views&sort=-views&access_token=${yt_accessToken}`
      ).then((r) => r.json()); 

}
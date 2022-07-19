import date from "date-and-time";

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

export async function fetchBasicStat (yt_accessToken: string) {

    // Youtube Data API -> views, subscribers, uploads
    const channelStats = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?mine=true&part=snippet,contentDetails,statistics&access_token=${yt_accessToken}`
      ).then((r) => r.json());
      const { viewCount, subscriberCount, videoCount } =
        channelStats.items[0].statistics;
    
    // Youtube Data API -> Get top 5 videos from 'Uploads' playlist
      const playlistId =
        channelStats.items[0].contentDetails.relatedPlaylists.uploads;
    
      const uploadPlaylist = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=5&playlistId=${playlistId}&key=${process.env.YT_API_KEY}`
      ).then((r) => r.json());
      const videoIdList = <string[]>uploadPlaylist.items.map((e: PlaylistItem) => {
        return e.contentDetails.videoId;
      });
    
      const videoStatsList = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,player&id=${videoIdList.toString()}&key=${
          process.env.YT_API_KEY
        }`
      ).then((r) => r.json());
    
      const videoObjects = videoStatsList.items.map((e: VideoStat) => {
        return {
          title: e.snippet.title,
          view_count: e.statistics.viewCount,
          like_count: e.statistics.likeCount,
          comment_count: e.statistics.commentCount,
        };
      });

      return {viewCount, subscriberCount, videoCount, videoObjects}
}


export async function fetchDemoGeo (yt_accessToken: string) {
      // Youtube Analytics API -> Demographics (age&gender)
  const dateNow = new Date();
  const formattedDateNow = date.format(dateNow, "YYYY-MM-DD");
  const demographics = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=ageGroup,gender&startDate=2000-05-01&endDate=${formattedDateNow}&ids=channel==MINE&metrics=viewerPercentage&sort=gender,ageGroup&access_token=${yt_accessToken}`
  ).then((r) => r.json()).then(json=> json.rows)

  // Youtube Analytics API -> Geographics (Country by views)
  const geographics = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&startDate=2000-05-01&endDate=${formattedDateNow}&ids=channel==MINE&metrics=views&sort=views&access_token=${yt_accessToken}`
  ).then((r) => r.json()).then(json=>json.rows);

  return {demographics, geographics}
}


export async function fetchIntervalData (yt_accessToken: string) {
    let day = new Date(), prevDay = new Date(), week = new Date(), month = new Date()
    prevDay.setDate(week.getDate()-3)
    week.setDate(week.getDate()-9)
    month.setDate(month.getDate()-31)
    const dayFormat = date.format(day, "YYYY-MM-DD");
    const prevDayFormat = date.format(prevDay, "YYYY-MM-DD");
    const weekFormat = date.format(week, "YYYY-MM-DD");
    const monthFormat = date.format(month, "YYYY-MM-DD");

    const data_intervals: IntervalData = {day: [],week: [],month: []}

    const dailyData = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${prevDayFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=views,likes,subscribersGained&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => data_intervals.day = json.rows);

    const weeklyData = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${weekFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=views,likes,subscribersGained&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => data_intervals.week = json.rows)

    const monthlyData = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${monthFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=views,likes,subscribersGained&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => data_intervals.month = json.rows);



      return data_intervals

}
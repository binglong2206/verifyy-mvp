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
    let day = new Date(), week = new Date(), month = new Date()
    week.setDate(week.getDate()-9)
    month.setDate(month.getDate()-31)
    const dayFormat = date.format(day, "YYYY-MM-DD");
    const weekFormat = date.format(week, "YYYY-MM-DD");
    const monthFormat = date.format(month, "YYYY-MM-DD");

    const views_interval = {
        day: [],
        week: [],
        month: []
    }
    const views_day = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${dayFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=views&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => views_interval.day = json.rows);

    const views_week = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${weekFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=views&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => views_interval.week = json.rows)

    const views_month = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${monthFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=views&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => views_interval.month = json.rows);

    const likes_interval = {
        day: [],
        week: [],
        month: []
    }
    const likes_day = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${dayFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=likes&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => likes_interval.day = json.rows);

    const likes_week = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${weekFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=likes&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => likes_interval.week = json.rows)

    const likes_month = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${monthFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=likes&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => likes_interval.month = json.rows);


      const follower_interval = {
        day: [],
        week: [],
        month: []
    }
    const follower_day = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${dayFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=subscribersGained&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => follower_interval.day = json.rows);

    const follower_week = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${weekFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=subscribersGained&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => follower_interval.week = json.rows)

    const follower_month = await fetch(
        `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=day&startDate=${monthFormat}&endDate=${dayFormat}&ids=channel==MINE&metrics=subscribersGained&sort=day&access_token=${yt_accessToken}`
      ).then((r) => r.json()).then(json => follower_interval.month = json.rows);


      return {views_interval, likes_interval, follower_interval}

}
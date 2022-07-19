//@ts-ignore
import timestamp from 'unix-timestamp';
timestamp.round = true;

interface DataPoint { // date, followers | engagement | impressions
  [key: string]: string | number;
  end_time: string
  value: number;
}

interface IntervalData { 
  day: {
    follower_count: DataPoint[];
    engagement_count: DataPoint[];
    impression_count: DataPoint[];
  }
  week: {
    follower_count: DataPoint[];
    engagement_count: DataPoint[]
    impression_count: DataPoint[];
  }  
  month: {
    follower_count: DataPoint[];
    engagement_count: DataPoint[]
    impression_count: DataPoint[];
  }
}



export async function fetchIntervalData(pageId: string, pageAccessToken: string) {
  const data_intervals: IntervalData = {
    day: {follower_count:[], impression_count:[], engagement_count:[]}, 
    week: {follower_count:[], impression_count:[], engagement_count:[]}, 
    month:{follower_count:[], impression_count:[],engagement_count:[]}
  };

  const daily_data = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}/insights?metric=page_fan_adds,page_engaged_users,page_impressions&period=day&date_preset=yesterday&access_token=${pageAccessToken}`)
    .then((r) => r.json()).then(json=> {
      data_intervals.day.follower_count = json.data[0].values;
      data_intervals.day.engagement_count = json.data[1].values;
      data_intervals.day.impression_count = json.data[2].values
    });
  
  const weekly_data = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}/insights?metric=page_fan_adds,page_engaged_users,page_impressions&period=day&date_preset=last_7d&access_token=${pageAccessToken}`)
      .then((r) => r.json()).then(json=> {
        data_intervals.week.follower_count = json.data[0].values;
      data_intervals.week.engagement_count = json.data[1].values;
      data_intervals.week.impression_count = json.data[2].values
      });

  const monthly_data = await fetch(
    `https://graph.facebook.com/v14.0/${pageId}/insights?metric=page_fan_adds,page_engaged_users,page_impressions&period=day&date_preset=last_28d&access_token=${pageAccessToken}`)
        .then((r) => r.json()).then(json=> {
      data_intervals.month.follower_count = json.data[0].values;
      data_intervals.month.engagement_count = json.data[1].values;
      data_intervals.month.impression_count = json.data[2].values

        });
  
  return data_intervals
}
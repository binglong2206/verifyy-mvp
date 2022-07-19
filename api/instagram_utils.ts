//@ts-ignore
import timestamp from 'unix-timestamp';
timestamp.round = true;

interface DataPoint {
  [key: string]: string | number;
  value: number;
  end_time: string

}
interface IntervalData { // date, followers, impressions, reach
  day: {
    follower_count: DataPoint[];
    impression_count: DataPoint[];
    reach_count: DataPoint[]
  }
  week: {
    follower_count: DataPoint[];
    impression_count: DataPoint[];
    reach_count: DataPoint[]
  }  
  month: {
    follower_count: DataPoint[];
    impression_count: DataPoint[];
    reach_count: DataPoint[]
  }
}



export async function fetchIntervalData(instagramId: string, accessToken: string) {
  const data_intervals: IntervalData = {
    day: {follower_count:[], impression_count:[], reach_count:[]}, 
    week: {follower_count:[], impression_count:[], reach_count:[]}, 
    month:{follower_count:[], impression_count:[], reach_count:[]}
  };

  const daily_data = await fetch(
    `https://graph.facebook.com/v14.0/${instagramId}/insights?metric=follower_count,impressions,reach&period=day&access_token=${accessToken}`)
    .then((r) => r.json()).then(json=> {
      data_intervals.day.follower_count = json.data[0].values;
      data_intervals.day.impression_count = json.data[1].values
      data_intervals.day.reach_count = json.data[2].values
    });
  
  const weekly_data = await fetch(
      `https://graph.facebook.com/v14.0/${instagramId}/insights?metric=follower_count,impressions,reach&period=day&since=${timestamp.now('-7d')}&until=${timestamp.now()}&access_token=${accessToken}`)
      .then((r) => r.json()).then(json=> {
        data_intervals.week.follower_count = json.data[0].values;
      data_intervals.week.impression_count = json.data[1].values
      data_intervals.week.reach_count = json.data[2].values
      });

  const monthly_data = await fetch(
        `https://graph.facebook.com/v14.0/${instagramId}/insights?metric=follower_count,impressions,reach&period=day&since=${timestamp.now('-28d')}&until=${timestamp.now()}&access_token=${accessToken}`)
        .then((r) => r.json()).then(json=> {
      data_intervals.month.follower_count = json.data[0].values;
      data_intervals.month.impression_count = json.data[1].values
      data_intervals.month.reach_count = json.data[2].values
        });
  
  return data_intervals
}
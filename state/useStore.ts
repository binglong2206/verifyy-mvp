import create from "zustand";

interface User {
  username: string;
  email: string;
  setUserState: (email: string, username?: string) => void;
}


interface YT_details {
  id: number
  subscriber_count: number,
  upload_count: number,
  demographics: any,
  geographics: any,
  medias: any,
}

interface Youtube extends YT_details {
  setYoutubeState: ({id,subscriber_count,upload_count,demographics,geographics,medias}: YT_details) => void
}

interface IG_details {
  id: number,
  username: number,
  follower_count: number,
  media_count: number,
  demographics: any[],
  geographics: any[],
  medias: any[],
}

interface Instagram extends IG_details {
  setInstagramState: ({id,username,follower_count,media_count,demographics,geographics,medias}: IG_details) => void
}




interface FB_details {
  id: number,
  follower_count: number,
  like_count: number,
  media_count: number,
  demographics: any[],
  geographics: any[],
  medias: any[],
}

interface Facebook extends FB_details {
  setFacebookState: ({id,follower_count,like_count, media_count,demographics,geographics,medias}: FB_details) => void
}



// Set(state => {...}) -> use state if you want access to prev state
// If not, set({...}) directly will suffice
export const useUserStore = create<User>()((set) => ({
  username: "",
  email: "",

  setUserState: (email: string, username?: string): void => {
    set({
      username: username,
      email: email,
    });
  },
}));

interface Dog {
  cat: number
}

export const useYoutubeStore = create<Youtube>()((set)=> ({
  id: 0,
  subscriber_count: 0,
  upload_count: 0,
  demographics: null,
  geographics: null,
  medias: null,

  setYoutubeState: (props: YT_details):void => {
    for (let key in props) {
      set({
        [key]: props[key as keyof YT_details] // woohoo!
      })
    }
  },

}))




export const useInstagramStore = create<Instagram>()((set)=> ({
  id: 2,
  username: 0,
  follower_count: 0,
  media_count: 0,
  demographics: [],
  geographics: [],
  medias: [],
  setInstagramState: (props: IG_details):void => {
    for (let key in props) {
      set({
        [key]: props[key as keyof IG_details] // woohoo!
      })
    }
  },
}))

export const useFacebookStore = create<Facebook>()((set)=> ({
  id: 8,
  follower_count: 0,
  like_count: 0,
  media_count: 0,
  demographics: [],
  geographics: [],
  medias: [],
  setFacebookState: (props: FB_details) => {
    for (let key in props) {
      set({
        [key]: props[key as keyof FB_details]
      })
    }
  }
}))
